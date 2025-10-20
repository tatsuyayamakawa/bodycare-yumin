/**
 * Square Customers API
 *
 * 顧客情報の管理・連携を行います
 */

import { squareClient } from './client';
import type { SquareCustomer, CustomerSearchParams } from './types';
import { handleSquareError, formatPhoneNumberForSquare } from './utils';

/**
 * メールアドレスで顧客を検索
 *
 * @param email - メールアドレス
 * @returns 見つかった顧客、見つからない場合はnull
 */
export async function searchCustomerByEmail(email: string): Promise<SquareCustomer | null> {
  try {
    const { result } = await squareClient.customersApi.searchCustomers({
      query: {
        filter: {
          emailAddress: {
            exact: email,
          },
        },
      },
    });

    if (result.customers && result.customers.length > 0) {
      const customer = result.customers[0];
      return {
        id: customer.id!,
        emailAddress: customer.emailAddress,
        givenName: customer.givenName,
        familyName: customer.familyName,
        phoneNumber: customer.phoneNumber,
        referenceId: customer.referenceId,
        createdAt: customer.createdAt!,
        updatedAt: customer.updatedAt!,
        version: customer.version,
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to search customer by email:', error);
    throw new Error(handleSquareError(error));
  }
}

/**
 * 電話番号で顧客を検索
 *
 * @param phone - 電話番号
 * @returns 見つかった顧客、見つからない場合はnull
 */
export async function searchCustomerByPhone(phone: string): Promise<SquareCustomer | null> {
  try {
    const formattedPhone = formatPhoneNumberForSquare(phone);

    const { result } = await squareClient.customersApi.searchCustomers({
      query: {
        filter: {
          phoneNumber: {
            exact: formattedPhone,
          },
        },
      },
    });

    if (result.customers && result.customers.length > 0) {
      const customer = result.customers[0];
      return {
        id: customer.id!,
        emailAddress: customer.emailAddress,
        givenName: customer.givenName,
        familyName: customer.familyName,
        phoneNumber: customer.phoneNumber,
        referenceId: customer.referenceId,
        createdAt: customer.createdAt!,
        updatedAt: customer.updatedAt!,
        version: customer.version,
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to search customer by phone:', error);
    throw new Error(handleSquareError(error));
  }
}

/**
 * 名前で顧客を検索
 *
 * @param name - 顧客名（姓名）
 * @returns 見つかった顧客の配列
 */
export async function searchCustomersByName(name: string): Promise<SquareCustomer[]> {
  try {
    const { result } = await squareClient.customersApi.searchCustomers({
      query: {
        filter: {
          givenName: {
            fuzzy: name,
          },
        },
      },
    });

    if (!result.customers || result.customers.length === 0) {
      return [];
    }

    return result.customers.map((customer) => ({
      id: customer.id!,
      emailAddress: customer.emailAddress,
      givenName: customer.givenName,
      familyName: customer.familyName,
      phoneNumber: customer.phoneNumber,
      referenceId: customer.referenceId,
      createdAt: customer.createdAt!,
      updatedAt: customer.updatedAt!,
      version: customer.version,
    }));
  } catch (error) {
    console.error('Failed to search customers by name:', error);
    throw new Error(handleSquareError(error));
  }
}

/**
 * 新しい顧客を作成
 *
 * @param params - 顧客情報
 * @returns 作成された顧客
 */
export async function createCustomer(params: {
  email: string;
  name: string;
  phone?: string;
  referenceId?: string;
}): Promise<SquareCustomer> {
  try {
    const { email, name, phone, referenceId } = params;
    
    // 名前を姓名に分割（簡易的な処理）
    const nameParts = name.trim().split(/\s+/);
    const familyName = nameParts[0] || '';
    const givenName = nameParts.slice(1).join(' ') || '';

    const { result } = await squareClient.customersApi.createCustomer({
      emailAddress: email,
      givenName: givenName || name,
      familyName: familyName,
      phoneNumber: phone ? formatPhoneNumberForSquare(phone) : undefined,
      referenceId: referenceId,
    });

    if (!result.customer) {
      throw new Error('顧客の作成に失敗しました');
    }

    const customer = result.customer;
    return {
      id: customer.id!,
      emailAddress: customer.emailAddress,
      givenName: customer.givenName,
      familyName: customer.familyName,
      phoneNumber: customer.phoneNumber,
      referenceId: customer.referenceId,
      createdAt: customer.createdAt!,
      updatedAt: customer.updatedAt!,
      version: customer.version,
    };
  } catch (error) {
    console.error('Failed to create customer:', error);
    throw new Error(handleSquareError(error));
  }
}

/**
 * 顧客情報を更新
 *
 * @param customerId - Square顧客ID
 * @param params - 更新する情報
 * @returns 更新された顧客
 */
export async function updateCustomer(
  customerId: string,
  params: {
    email?: string;
    name?: string;
    phone?: string;
    version?: number;
  }
): Promise<SquareCustomer> {
  try {
    const { email, name, phone, version } = params;

    let givenName: string | undefined;
    let familyName: string | undefined;

    if (name) {
      const nameParts = name.trim().split(/\s+/);
      familyName = nameParts[0] || '';
      givenName = nameParts.slice(1).join(' ') || '';
    }

    const { result } = await squareClient.customersApi.updateCustomer(customerId, {
      emailAddress: email,
      givenName: givenName,
      familyName: familyName,
      phoneNumber: phone ? formatPhoneNumberForSquare(phone) : undefined,
      version: version,
    });

    if (!result.customer) {
      throw new Error('顧客情報の更新に失敗しました');
    }

    const customer = result.customer;
    return {
      id: customer.id!,
      emailAddress: customer.emailAddress,
      givenName: customer.givenName,
      familyName: customer.familyName,
      phoneNumber: customer.phoneNumber,
      referenceId: customer.referenceId,
      createdAt: customer.createdAt!,
      updatedAt: customer.updatedAt!,
      version: customer.version,
    };
  } catch (error) {
    console.error('Failed to update customer:', error);
    throw new Error(handleSquareError(error));
  }
}

/**
 * 顧客を取得
 *
 * @param customerId - Square顧客ID
 * @returns 顧客情報
 */
export async function getCustomer(customerId: string): Promise<SquareCustomer | null> {
  try {
    const { result } = await squareClient.customersApi.retrieveCustomer(customerId);

    if (!result.customer) {
      return null;
    }

    const customer = result.customer;
    return {
      id: customer.id!,
      emailAddress: customer.emailAddress,
      givenName: customer.givenName,
      familyName: customer.familyName,
      phoneNumber: customer.phoneNumber,
      referenceId: customer.referenceId,
      createdAt: customer.createdAt!,
      updatedAt: customer.updatedAt!,
      version: customer.version,
    };
  } catch (error) {
    console.error('Failed to get customer:', error);
    throw new Error(handleSquareError(error));
  }
}

/**
 * HP会員とSquare顧客を連携
 * 
 * 1. メールアドレスで完全一致検索
 * 2. 見つからない場合は電話番号で検索（電話番号がある場合）
 * 3. それでも見つからない場合は新規作成
 *
 * @param params - 顧客情報
 * @returns Square顧客ID
 */
export async function linkOrCreateSquareCustomer(params: {
  userId: string;
  email: string;
  name: string;
  phone?: string;
}): Promise<string> {
  const { userId, email, name, phone } = params;

  try {
    // 1. メールアドレスで検索
    let customer = await searchCustomerByEmail(email);

    // 2. 電話番号で検索
    if (!customer && phone) {
      customer = await searchCustomerByPhone(phone);
    }

    // 3. 見つからない場合は新規作成
    if (!customer) {
      customer = await createCustomer({
        email,
        name,
        phone,
        referenceId: userId, // Supabase user IDをreferenceIdに設定
      });
    }

    return customer.id;
  } catch (error) {
    console.error('Failed to link or create Square customer:', error);
    throw error;
  }
}
