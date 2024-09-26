import Image from "next/image";

export default function Navbar() {
  return (
    <div className="  text-center p-2 font-semibold text-xl flex justify-between">
      <div></div>
      <div className="flex gap-4">
        <a href="/">
          <Image src={"/images/logo.png"} width={150} height={100} />
        </a>
      </div>
      <div>Cart</div>
    </div>
  );
}
