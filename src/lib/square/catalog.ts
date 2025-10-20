/**
 * Square Catalog API
 *
 * 施術メニュー（サービス）の取得・管理を行います
 */

import { squareClient, SQUARE_LOCATION_ID } from './client';
import type { SquareService, SquareCatalogItem } from './types';
import { handleSquareError } from './utils';

/**
 * 全ての施術メニューを取得
 *
 * @returns 施術メニューの配列
 */
export async function listServices(): Promise<SquareService[]> {
  try {
    const { result } = await squareClient.catalogApi.listCatalog(
      undefined, // cursor
      'ITEM' // types - ITEMタイプのみ取得
    );

    if (!result.objects) {
      return [];
    }

    // カテゴリ情報を取得（施術メニューの分類用）
    const categoryMap = await getCategoryMap();

    // ITEMをサービス情報に変換
    const services: SquareService[] = [];

    for (const item of result.objects) {
      if (item.type !== 'ITEM' || !item.itemData) {
        continue;
      }

      // 各バリエーションをサービスとして追加
      const variations = item.itemData.variations || [];
      
      for (const variation of variations) {
        if (!variation.itemVariationData) {
          continue;
        }

        const variationData = variation.itemVariationData;
        const price = variationData.priceMoney?.amount || 0;
        const currency = variationData.priceMoney?.currency || 'JPY';
        const duration = variationData.serviceDuration || 60;

        // 画像URLの取得（もしあれば）
        const imageUrl = item.itemData.imageIds?.[0]
          ? await getImageUrl(item.itemData.imageIds[0])
          : undefined;

        services.push({
          id: variation.id,
          name: `${item.itemData.name}${variationData.name !== 'Regular' ? ` - ${variationData.name}` : ''}`,
          description: item.itemData.description,
          price,
          currency,
          duration,
          categoryId: item.itemData.categoryId,
          categoryName: item.itemData.categoryId
            ? categoryMap.get(item.itemData.categoryId)
            : undefined,
          imageUrl,
        });
      }
    }

    return services.sort((a, b) => {
      // カテゴリ順、次に価格順でソート
      if (a.categoryName && b.categoryName && a.categoryName !== b.categoryName) {
        return a.categoryName.localeCompare(b.categoryName, 'ja');
      }
      return a.price - b.price;
    });
  } catch (error) {
    console.error('Failed to list services:', error);
    throw new Error(handleSquareError(error));
  }
}

/**
 * 特定の施術メニューを取得
 *
 * @param serviceId - サービスID（Item Variation ID）
 * @returns 施術メニュー情報
 */
export async function getService(serviceId: string): Promise<SquareService | null> {
  try {
    const { result } = await squareClient.catalogApi.retrieveCatalogObject(
      serviceId,
      true // includeRelatedObjects - 関連オブジェクト（親アイテムなど）も取得
    );

    if (!result.object || result.object.type !== 'ITEM_VARIATION') {
      return null;
    }

    const variation = result.object;
    const variationData = variation.itemVariationData;

    if (!variationData) {
      return null;
    }

    // 親アイテムを探す
    const parentItem = result.relatedObjects?.find(
      (obj) => obj.type === 'ITEM' && obj.id === variation.itemVariationData?.itemId
    );

    const itemName = parentItem?.itemData?.name || '不明なサービス';
    const variationName = variationData.name;
    const description = parentItem?.itemData?.description;
    const categoryId = parentItem?.itemData?.categoryId;

    // カテゴリ名の取得
    let categoryName: string | undefined;
    if (categoryId) {
      const categoryMap = await getCategoryMap();
      categoryName = categoryMap.get(categoryId);
    }

    // 画像URLの取得
    const imageUrl = parentItem?.itemData?.imageIds?.[0]
      ? await getImageUrl(parentItem.itemData.imageIds[0])
      : undefined;

    return {
      id: serviceId,
      name: `${itemName}${variationName !== 'Regular' ? ` - ${variationName}` : ''}`,
      description,
      price: variationData.priceMoney?.amount || 0,
      currency: variationData.priceMoney?.currency || 'JPY',
      duration: variationData.serviceDuration || 60,
      categoryId,
      categoryName,
      imageUrl,
    };
  } catch (error) {
    console.error(`Failed to get service ${serviceId}:`, error);
    throw new Error(handleSquareError(error));
  }
}

/**
 * カテゴリIDと名前のマッピングを取得
 *
 * @returns カテゴリIDをキー、カテゴリ名を値とするMap
 */
async function getCategoryMap(): Promise<Map<string, string>> {
  const categoryMap = new Map<string, string>();

  try {
    const { result } = await squareClient.catalogApi.listCatalog(
      undefined,
      'CATEGORY'
    );

    if (result.objects) {
      for (const category of result.objects) {
        if (category.type === 'CATEGORY' && category.categoryData?.name) {
          categoryMap.set(category.id, category.categoryData.name);
        }
      }
    }
  } catch (error) {
    console.error('Failed to get categories:', error);
  }

  return categoryMap;
}

/**
 * 画像URLを取得
 *
 * @param imageId - 画像ID
 * @returns 画像URL
 */
async function getImageUrl(imageId: string): Promise<string | undefined> {
  try {
    const { result } = await squareClient.catalogApi.retrieveCatalogObject(imageId);

    if (result.object?.type === 'IMAGE' && result.object.imageData?.url) {
      return result.object.imageData.url;
    }
  } catch (error) {
    console.error(`Failed to get image ${imageId}:`, error);
  }

  return undefined;
}

/**
 * カテゴリごとに施術メニューをグループ化
 *
 * @returns カテゴリ名をキー、サービス配列を値とするMap
 */
export async function getServicesByCategory(): Promise<Map<string, SquareService[]>> {
  const services = await listServices();
  const grouped = new Map<string, SquareService[]>();

  for (const service of services) {
    const categoryName = service.categoryName || 'その他';
    const categoryServices = grouped.get(categoryName) || [];
    categoryServices.push(service);
    grouped.set(categoryName, categoryServices);
  }

  return grouped;
}

/**
 * 施術メニューを検索
 *
 * @param query - 検索クエリ（名前、説明で検索）
 * @returns マッチした施術メニューの配列
 */
export async function searchServices(query: string): Promise<SquareService[]> {
  const services = await listServices();
  const lowerQuery = query.toLowerCase();

  return services.filter((service) => {
    const nameMatch = service.name.toLowerCase().includes(lowerQuery);
    const descMatch = service.description?.toLowerCase().includes(lowerQuery);
    const categoryMatch = service.categoryName?.toLowerCase().includes(lowerQuery);

    return nameMatch || descMatch || categoryMatch;
  });
}
