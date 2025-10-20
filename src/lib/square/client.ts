/**
 * Square API Client初期化
 *
 * Square APIとの通信を行うためのクライアントを初期化します。
 * 環境変数からアクセストークンと環境設定を読み込みます。
 */

import { Client, Environment } from "square";

// 環境設定の検証
if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error(
    "SQUARE_ACCESS_TOKEN is not defined in environment variables",
  );
}

if (!process.env.SQUARE_LOCATION_ID) {
  throw new Error("SQUARE_LOCATION_ID is not defined in environment variables");
}

// 環境の決定（sandbox or production）
const environment =
  process.env.SQUARE_ENVIRONMENT === "production"
    ? Environment.Production
    : Environment.Sandbox;

/**
 * Square APIクライアントインスタンス
 */
export const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment,
});

/**
 * Square Location ID
 * 予約や決済で使用する店舗ID
 */
export const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

/**
 * 現在の環境が本番環境かどうか
 */
export const isProduction = environment === Environment.Production;

/**
 * 環境名を文字列で返す
 */
export const getEnvironmentName = (): "sandbox" | "production" => {
  return isProduction ? "production" : "sandbox";
};
