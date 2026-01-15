import { bizInfo } from "@/app/constants/bizInfo";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-white bg-opacity-95 backdrop-blur-sm shadow-inner mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col items-center gap-3">
        {/* 로고 */}
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} 로또 데이터 실험실 All rights reserved.
          </div>
        </div>

        {/* 약관 / 개인정보 / 문의 */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <a href="/terms" className="hover:text-gray-700">
            이용약관
          </a>
          <span>|</span>
          <a href="/privacy" className="hover:text-gray-700">
            개인정보처리방침
          </a>
          <span>|</span>
          <a
            href={`mailto:${bizInfo.contactEmail}`}
            className="hover:text-gray-700"
          >
            문의: {bizInfo.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
