/**
 * 施術メニュー関連のServer Actions
 */

'use server';

import { listServices, getService, getServicesByCategory, searchServices } from '@/lib/square/catalog';
import type { SquareService } from '@/lib/square/types';

/**
 * 全ての施術メニューを取得
 *
 * @returns 施術メニューの配列
 */
export async function getServicesAction(): Promise<{
  success: boolean;
  services?: SquareService[];
  error?: string;
}> {
  try {
    const services = await listServices();
    return {
      success: true,
      services,
    };
  } catch (error) {
    console.error('Failed to get services:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '施術メニューの取得に失敗しました',
    };
  }
}

/**
 * 特定の施術メニューを取得
 *
 * @param serviceId - サービスID
 * @returns 施術メニュー情報
 */
export async function getServiceAction(serviceId: string): Promise<{
  success: boolean;
  service?: SquareService;
  error?: string;
}> {
  try {
    const service = await getService(serviceId);

    if (!service) {
      return {
        success: false,
        error: '施術メニューが見つかりませんでした',
      };
    }

    return {
      success: true,
      service,
    };
  } catch (error) {
    console.error('Failed to get service:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '施術メニューの取得に失敗しました',
    };
  }
}

/**
 * カテゴリごとに施術メニューを取得
 *
 * @returns カテゴリ名をキー、サービス配列を値とするオブジェクト
 */
export async function getServicesByCategoryAction(): Promise<{
  success: boolean;
  servicesByCategory?: Record<string, SquareService[]>;
  error?: string;
}> {
  try {
    const servicesMap = await getServicesByCategory();
    
    // Mapをオブジェクトに変換（JSONシリアライズ可能にするため）
    const servicesByCategory: Record<string, SquareService[]> = {};
    servicesMap.forEach((services, category) => {
      servicesByCategory[category] = services;
    });

    return {
      success: true,
      servicesByCategory,
    };
  } catch (error) {
    console.error('Failed to get services by category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '施術メニューの取得に失敗しました',
    };
  }
}

/**
 * 施術メニューを検索
 *
 * @param query - 検索クエリ
 * @returns マッチした施術メニューの配列
 */
export async function searchServicesAction(query: string): Promise<{
  success: boolean;
  services?: SquareService[];
  error?: string;
}> {
  try {
    if (!query.trim()) {
      return {
        success: true,
        services: [],
      };
    }

    const services = await searchServices(query);
    return {
      success: true,
      services,
    };
  } catch (error) {
    console.error('Failed to search services:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '施術メニューの検索に失敗しました',
    };
  }
}
