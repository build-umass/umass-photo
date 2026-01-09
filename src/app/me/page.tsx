import Image from "next/image";
import UserDataInterface from "./UserDataInterface";

const BACKGROUND_SRC =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Old_Chapel_6.JPG/2048px-Old_Chapel_6.JPG?20131108195343";
export default function MePage() {
  return (
    <>
      <section className="relative flex grow items-center justify-center">
        <Image
          fill
          src={BACKGROUND_SRC}
          alt="Old Chapel at UMass Amherst"
          className="object-cover"
        ></Image>
        <div className="aria-hidden absolute inset-0 bg-black/25"></div>
        <UserDataInterface></UserDataInterface>
        <a
          className="absolute right-0 bottom-0 text-xs text-white"
          href="https://commons.wikimedia.org/wiki/File:Old_Chapel_6.JPG"
        >
          Background image by Jon Platek, CC BY-SA 3.0
          &lt;https://creativecommons.org/licenses/by-sa/3.0&gt;, via Wikimedia
          Commons
        </a>
      </section>
    </>
  );
}
