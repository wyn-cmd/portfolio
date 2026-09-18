# Wynston Wong - Portfolio

Personal portfolio site for Wynston Wong Jun De, an Artificial Intelligence Engineer Intern at SQL VIEW and a Cybersecurity and Digital Forensics student at Ngee Ann Polytechnic specialising in AI and Machine Learning.

Live site: https://wyn-cmd.github.io/portfolio/

Plain HTML, CSS and JavaScript. No build step, no dependencies, no framework, no package manager. Clone it and open `index.html`.

## Pages

- `index.html` - introduction, profile summary, headline numbers, three focus areas and six selected projects
- `projects/index.html` - all 33 non-fork GitHub projects, split into security and forensics, AI and machine learning, systems and tooling, and coursework, with filter buttons
- `experience/index.html` - education, work, the nine skill areas, competition results, leadership and volunteering, and referees
- `contact/index.html` - contact channels and the kind of work I am looking for

## Structure

Each page is a directory holding its own `index.html`, so the URLs carry no file extension. GitHub Pages serves `/experience/` from `experience/index.html`, and `/experience` redirects to the trailing-slash form on its own.

```
index.html              home
projects/index.html
experience/index.html
contact/index.html
style.css               design tokens for both palettes, then components, responsive rules and print styles
script.js               theme toggle, mobile navigation, project filtering, scroll reveal, terminal typing effect
```

`style.css` and `script.js` sit at the root and every page references them with a path relative to its own depth: `style.css` from the home page, `../style.css` from the three subpages. Those paths are relative on purpose so the site works unchanged whether it is served from a domain root, from a project subpath like `https://wyn-cmd.github.io/portfolio/`, or opened straight off disk. Root-absolute paths such as `/style.css` break the project-subpath case.

## Running it locally

Opening `index.html` directly works. To preview it the way GitHub Pages serves it, including the extensionless directory URLs, run a static server from this folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000/ and http://localhost:8000/projects/.

## Design notes

- Light and dark palettes are driven by `data-theme` on the `<html>` element. The choice is stored under the `portfolio-theme` key in localStorage and applied by a small inline script in each page head, before first paint, so there is no flash of the wrong palette.
- Motion respects `prefers-reduced-motion`.
- `experience/index.html` carries a print stylesheet, so printing it gives a usable CV.
- The site has no external runtime dependencies beyond an optional Google Fonts link. It falls back to a system font stack offline.

## Maintenance notes

- Add a project by copying an existing card in `projects/index.html` and setting `data-category` to `security`, `ai`, `systems` or `coursework`. The filter buttons pick it up automatically.
- Add a page as `pagename/index.html`, reference the shared assets as `../style.css` and `../script.js`, then add it to the four nav blocks and both footer link lists.
- Project counts are written by hand: the "All 33" filter button, the headline on the projects page and the stat blocks. Update them when the count changes.
- Referee entries list names and roles only, on purpose. Do not add personal phone numbers or email addresses to this site.

## Content sources

Material came from the CV, from the public repositories under [wyn-cmd](https://github.com/wyn-cmd), and from the LinkedIn profile at [linkedin.com/in/wynston-wong-290189304](https://www.linkedin.com/in/wynston-wong-290189304/). LinkedIn is the source for the SQL VIEW internship, the React and Next.js skills, the LLMOps and agentic workflow skills, the Year 2 Semester 2 Class Chairperson role, and the 4G Class Chairperson and Head of Training ICs positions at Greendale.
