// REST API 公共助手:统一 JSON 响应 + 开放 CORS(让任意外部 bot 能跨域调用)。
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });
}

export function options() {
  return new Response(null, { status: 204, headers: CORS });
}

// 列表接口里按需把答案去掉,返回更轻的元信息
export function stripAnswer<T extends { answer: string }>(q: T) {
  const { answer, ...rest } = q;
  void answer;
  return rest;
}
