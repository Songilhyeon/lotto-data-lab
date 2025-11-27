"use client";
import React from "react";

const OAuthLoginPage = () => {
  const oauthUrls = {
    google: process.env.NEXT_PUBLIC_GOOGLE_API_URI,
    naver: process.env.NEXT_PUBLIC_NAVER_API_URI,
    kakao: process.env.NEXT_PUBLIC_KAKAO_API_URI,
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">OAuth Login</h1>
      <a href={oauthUrls.google}>
        <button className="bg-red-500 text-white px-6 py-2 rounded">
          Login with Google
        </button>
      </a>
      <a href={oauthUrls.naver}>
        <button className="bg-green-500 text-white px-6 py-2 rounded">
          Login with Naver
        </button>
      </a>
      <a href={oauthUrls.kakao}>
        <button className="bg-yellow-400 text-black px-6 py-2 rounded">
          Login with Kakao
        </button>
      </a>
    </div>
  );
};

export default OAuthLoginPage;
