// pages/index.js
import dynamic from "next/dynamic";

const RealEstateDapp = dynamic(() => import("../Components/RealEstateDapp"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <RealEstateDapp />
    </div>
  );
}
