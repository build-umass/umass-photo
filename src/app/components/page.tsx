import Navbar from "./navbar/navbar"; // Import Navbar from the navbar folder
import Footer from "./footer/footer"; // Import Footer from the footer folder
import MarkdownElement from "./markdown/MarkdownElement";

export default function ComponentsPreview() {
  const testContent = (`
# Header

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.
`).trim();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <MarkdownElement content={testContent}></MarkdownElement>
      <Footer />
    </div>
  );
}
