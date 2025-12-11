import LegalDocument from "@/app/components/LegalDocument";
import { bizInfo } from "@/app/constants/bizInfo";

export default function PrivacyPage() {
  return (
    <LegalDocument title="개인정보처리방침">
      <p>
        {bizInfo.companyName}(이하 “서비스”)는 「개인정보 보호법」 등 관련
        법령을 준수하며 이용자의 개인정보를 보호하기 위하여 최선을 다하고
        있습니다. 본 개인정보처리방침은 서비스 이용 시 제공되는 개인정보의 처리
        목적, 보유 기간, 보호 조치 등을 안내하기 위한 것입니다.
      </p>

      <h2>1. 수집하는 개인정보 항목</h2>
      <ul>
        <li>필수: 이메일, 로그인 정보(SNS 로그인 시 제공)</li>
        <li>자동 수집: 접속 기록, 쿠키, 브라우저/OS 정보</li>
      </ul>

      <h2>2. 개인정보의 처리 목적</h2>
      <ul>
        <li>회원 인증 및 서비스 제공</li>
        <li>서비스 품질 향상 및 이용 통계 분석</li>
        <li>부정 이용 방지 및 보안 강화</li>
      </ul>

      <h2>3. 개인정보 보유 및 이용 기간</h2>
      <p>
        서비스는 개인정보를 회원 탈퇴 시 즉시 삭제합니다. 단, 관련 법령에 따라
        일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.
      </p>

      <h2>4. 개인정보의 제3자 제공</h2>
      <p>
        서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 법령에
        의해 요구될 경우에 한하여 제공합니다.
      </p>

      <h2>5. 개인정보 처리 위탁</h2>
      <ul>
        <li>서버/호스팅: AWS, Vercel</li>
        <li>로그인: Google, Kakao(해당 시)</li>
        <li>분석 도구: Google Analytics</li>
      </ul>

      <h2>6. 이용자 권리</h2>
      <p>이용자는 언제든지 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.</p>

      <h2>7. 개인정보 보호책임자</h2>
      <ul>
        <li>담당자: {bizInfo.ownerName}</li>
        <li>이메일: {bizInfo.contactEmail}</li>
        <li>사업자등록번호: {bizInfo.businessNumber}</li>
        <li>주소: {bizInfo.address}</li>
        <li>전화번호: {bizInfo.tel}</li>
      </ul>

      <h2>8. 개인정보처리방침 변경</h2>
      <p>
        본 방침은 서비스 정책 또는 법령 개정에 따라 변경될 수 있으며, 변경 시
        서비스 내 공지를 통해 안내합니다.
      </p>
    </LegalDocument>
  );
}
