/**
 * 顧客管理関連のServer Actions
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createClientHelper } from '@/lib/supabase/client-helpers';
import { linkOrCreateSquareCustomer, getCustomer } from '@/lib/square/customers';

/**
 * 現在のユーザーとSquare顧客を連携
 * 
 * ログイン後、まだSquare顧客と連携していない場合に呼び出す
 */
export async function linkSquareCustomerAction(): Promise<{
  success: boolean;
  squareCustomerId?: string;
  error?: string;
}> {
  try {
    // 現在のユーザーを取得
    const supabase = createClientHelper();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: '認証が必要です',
      };
    }

    // customersテーブルから顧客情報を取得
    const adminSupabase = createClient();
    const { data: customer, error: customerError } = await adminSupabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (customerError || !customer) {
      return {
        success: false,
        error: '顧客情報が見つかりません',
      };
    }

    // 既に連携済みの場合
    if (customer.square_customer_id) {
      return {
        success: true,
        squareCustomerId: customer.square_customer_id,
      };
    }

    // Square顧客と連携または新規作成
    const squareCustomerId = await linkOrCreateSquareCustomer({
      userId: user.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone || undefined,
    });

    // customersテーブルを更新
    const { error: updateError } = await adminSupabase
      .from('customers')
      .update({
        square_customer_id: squareCustomerId,
        synced_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Failed to update customer:', updateError);
      return {
        success: false,
        error: '顧客情報の更新に失敗しました',
      };
    }

    return {
      success: true,
      squareCustomerId,
    };
  } catch (error) {
    console.error('Failed to link Square customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Square顧客との連携に失敗しました',
    };
  }
}

/**
 * Square顧客情報を取得
 */
export async function getSquareCustomerAction(): Promise<{
  success: boolean;
  customer?: {
    id: string;
    email?: string;
    name?: string;
    phone?: string;
  };
  error?: string;
}> {
  try {
    const supabase = createClientHelper();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: '認証が必要です',
      };
    }

    const adminSupabase = createClient();
    const { data: customer, error: customerError } = await adminSupabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (customerError || !customer) {
      return {
        success: false,
        error: '顧客情報が見つかりません',
      };
    }

    if (!customer.square_customer_id) {
      return {
        success: false,
        error: 'Square顧客と連携されていません',
      };
    }

    const squareCustomer = await getCustomer(customer.square_customer_id);

    if (!squareCustomer) {
      return {
        success: false,
        error: 'Square顧客が見つかりません',
      };
    }

    return {
      success: true,
      customer: {
        id: squareCustomer.id,
        email: squareCustomer.emailAddress,
        name: `${squareCustomer.familyName || ''} ${squareCustomer.givenName || ''}`.trim(),
        phone: squareCustomer.phoneNumber,
      },
    };
  } catch (error) {
    console.error('Failed to get Square customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Square顧客情報の取得に失敗しました',
    };
  }
}

/**
 * 顧客情報をSupabaseとSquareの両方で更新
 */
export async function updateCustomerAction(params: {
  name?: string;
  phone?: string;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createClientHelper();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: '認証が必要です',
      };
    }

    const adminSupabase = createClient();
    const { data: customer, error: customerError } = await adminSupabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (customerError || !customer) {
      return {
        success: false,
        error: '顧客情報が見つかりません',
      };
    }

    // Supabaseを更新
    const updateData: Record<string, any> = {};
    if (params.name) updateData.name = params.name;
    if (params.phone !== undefined) updateData.phone = params.phone;

    const { error: updateError } = await adminSupabase
      .from('customers')
      .update(updateData)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Failed to update customer in Supabase:', updateError);
      return {
        success: false,
        error: '顧客情報の更新に失敗しました',
      };
    }

    // Square顧客も更新（連携済みの場合）
    if (customer.square_customer_id) {
      const { updateCustomer } = await import('@/lib/square/customers');
      await updateCustomer(customer.square_customer_id, {
        name: params.name,
        phone: params.phone,
      });

      // 同期日時を更新
      await adminSupabase
        .from('customers')
        .update({ synced_at: new Date().toISOString() })
        .eq('user_id', user.id);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '顧客情報の更新に失敗しました',
    };
  }
}
