"use client";

import { useRef } from "react";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

type Status = "idle" | "pending" | "success" | "error";

export default function useRequestDedup<TParams extends JsonValue>() {
  const lastSuccessKeyRef = useRef<string | null>(null);
  const pendingKeyRef = useRef<string | null>(null);
  const statusRef = useRef<Status>("idle");

  const stableStringify = (value: JsonValue): string => {
    if (value === null || typeof value !== "object")
      return JSON.stringify(value);
    if (Array.isArray(value))
      return `[${value.map(stableStringify).join(",")}]`;

    const keys = Object.keys(value).sort();
    const entries = keys.map((k) => `"${k}":${stableStringify(value[k])}`);
    return `{${entries.join(",")}}`;
  };

  const makeKey = (params: TParams) => stableStringify(params);

  /**
   * 요청 시작 가능 여부 판단
   * - 같은 params가 "성공한 적" 있으면 스킵
   * - 같은 params가 "이미 pending"이면 스킵 (중복 클릭 방지)
   * - force=true면 무조건 허용
   */
  const begin = (params: TParams, force = false) => {
    const key = makeKey(params);

    if (force) {
      pendingKeyRef.current = key;
      statusRef.current = "pending";
      return { ok: true, key };
    }

    if (pendingKeyRef.current === key && statusRef.current === "pending") {
      return { ok: false, key };
    }

    if (lastSuccessKeyRef.current === key) {
      return { ok: false, key };
    }

    pendingKeyRef.current = key;
    statusRef.current = "pending";
    return { ok: true, key };
  };

  /**
   * 요청 성공 처리: 성공 키로 확정
   */
  const commit = (key: string) => {
    lastSuccessKeyRef.current = key;
    pendingKeyRef.current = null;
    statusRef.current = "success";
  };

  /**
   * 요청 실패 처리: pending 해제 (재시도 가능하게)
   */
  const rollback = () => {
    pendingKeyRef.current = null;
    statusRef.current = "error";
  };

  /** 성공 키까지 초기화 (완전 리셋) */
  const reset = () => {
    lastSuccessKeyRef.current = null;
    pendingKeyRef.current = null;
    statusRef.current = "idle";
  };

  return { begin, commit, rollback, reset };
}
