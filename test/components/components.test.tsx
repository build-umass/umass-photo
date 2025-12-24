import { describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import UmassPhotoButton from "@/app/components/UmassPhotoButton/index";

describe("Component Tests", () => {
    it("Umass Photo Button should have color", () => {
        render(<UmassPhotoButton>Example Text</UmassPhotoButton>);
        screen.getByText("Example Text")
    });
});
