# Illustration system

The site uses small editorial diagrams that teach the relationship behind each tool. Each illustration should help a reader predict what the page does before reading the controls.

The five core pages use [`css/site-system.css`](../css/site-system.css) for the same paper, ink, type, controls, and primary header as the templates. Library, Atlas, and Prompt Generator place tool-specific controls in a separate, compact toolbar. Compare and Examples use the primary header alone. The field guide keeps a wider reading layout but shares the palette, typography, brand mark, and primary links.

## Visual language

- Canvas: warm paper (`#F7F3EA`) with generous empty space.
- Main line: deep green (`#174B40`), usually 2–3 px with round joins.
- Secondary line: sage (`#9AAF9D` or `#B8C5B6`).
- Emphasis: rust (`#BA5538`) for the turning point, shared insight, or direction of travel.
- Forms: lightly imperfect paths, outlined cards, sparse annotations, and simple dots. Avoid gradients, stock figures, glossy objects, and decorative icon clouds.
- Size: SVG `viewBox="0 0 480 320"` so each drawing can be reused at different widths.

## Teaching role

| Page | Diagram | Idea conveyed |
| --- | --- | --- |
| Library | A tangled path becomes ordered steps | Move from observed friction to an intervention |
| Atlas | Connected islands of ideas | Fields of study share questions |
| Compare | Two marked pages meet at one insight | See overlap and difference |
| Prompt generator | Inputs converge into a document | Turn evidence into instructions |
| Examples | A marked-up case file | Observe, change, explain |
| Form template | A tangled path becomes ordered steps | Present essential fields before optional details |
| Trauma informed demo | A path with open choices | Keep control and a way back visible |

Every diagram has an adjacent short caption and an HTML image description. The SVG also includes a title and description for reuse outside its current page. New illustrations should keep meaningful information in text as well, so the page works when artwork is unavailable.

The shared illustration rules live in [`css/illustration-system.css`](../css/illustration-system.css). The template pages share [`css/template-system.css`](../css/template-system.css) for navigation, reading surfaces, controls, and responsive layout. The editable source artwork lives in [`assets/illustrations/`](../assets/illustrations/).
