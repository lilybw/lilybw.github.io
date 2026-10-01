import { JSX } from "solid-js/jsx-runtime";
import { GuaranteedResources, InternalResource, PredefinedResources, ReferencableResource } from "./types";
import { formatSVGElementID } from "./svgUtil";
import { getNextHash } from "../hashUtil";

/** An SVG `<mask>` rendered fresh per SVG instance; white content reveals, black hides.
 *  @example new Mask((defs) => <><rect width="24" height="24" fill="white" /><circle r="4" fill="black" /></>) */
export class Mask<T extends PredefinedResources = GuaranteedResources>
  implements InternalResource, ReferencableResource
{
  private name: string = "unnamed-mask-" + getNextHash();

  constructor(
    private readonly content: (defs: T) => JSX.Element,
    private readonly attributes: JSX.MaskSVGAttributes<SVGMaskElement> = {},
  ) {}

  getURL(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  toJSXElement(svgId: string, defs: PredefinedResources): JSX.Element {
    return (
      <mask id={formatSVGElementID(svgId, this.name)} {...this.attributes}>
        {this.content(defs as T)}
      </mask>
    );
  }
}