import { describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";

describe("Component Tests", () => {
  it("Umass Photo Button should have color", () => {
    render(<UmassPhotoButtonRed>Example Text</UmassPhotoButtonRed>);
    screen.getByText("Example Text");
  });
});
