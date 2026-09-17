# How the App Works

Think of the app like a little house:

- **HTML** builds the rooms and puts things in them.
- **CSS** decorates the rooms and makes them comfortable to use.
- **JavaScript** is the helpful person who listens, thinks, and shows the answer.

## HTML: The Page's Building Blocks

The HTML is in [index.html](index.html).

HTML is like the bones of the app. It decides what things exist on the page.

- The `<head>` gives the page a name, helps it fit on phones, connects the CSS file, and loads the JavaScript file.
- The `<header>` is the welcome area. It tells the user that the app compares skills with a job listing.
- The first main section is the input area. It has two big boxes:
  - **Your toolkit** is where the user types skills they know.
  - **The opportunity** is where the user types the skills a job asks for.
- The `<label>` elements tell users what each box is for. They also help screen readers understand the page.
- The **Compare fit** button gives JavaScript a signal to start comparing the two lists.
- The result section starts hidden. It becomes visible after a comparison and contains:
  - the percentage score,
  - a short explanation of the score,
  - skills that match, and
  - skills that are missing.
- The status message is a small talking spot for helpful messages, such as asking the user to enter a skill.

HTML does not calculate anything. It simply makes places for the user to type and places for the answer to appear.

## CSS: The App's Clothes and Furniture

The CSS is in [styles.css](styles.css).

CSS is like choosing the paint, furniture, and room layout for the house. It changes how the HTML looks without changing what the app thinks.

- The color variables at the top give names to the main colors, such as paper, teal, coral, and ink. This makes the colors easier to reuse.
- The universal rule gives every element a predictable size model, so boxes do not unexpectedly grow.
- The `body` rule chooses the background color, text color, and basic font.
- The `.page-shell` rule keeps the page from becoming too wide and adds comfortable space around it.
- The hero rules style the large welcome message at the top of the page.
- The heading rules make titles look different from normal instructions so the page is easy to scan.
- The `.input-grid` rule places the two input panels beside each other on a wide screen.
- The textarea rules make the typing boxes large enough for many skills.
- The button rules make **Compare fit** look like something the user can press. Hover and focus rules show when the button or a field is being used.
- The results rules make the score area stand out and place matched and missing skills in separate columns.
- The `@media` rules change the layout on a small screen. The columns become one column, the button fills the available width, and the results get smaller padding so everything fits on a phone.

CSS does not read the skills or calculate the percentage. It only makes the page clear, attractive, and usable.

## JavaScript: The App's Helper

The JavaScript is in [app.js](app.js).

JavaScript is like a helpful person running the game. It watches what the user does, checks the information, does the math, and updates the answer.

### Finding the Page Parts

At the top, JavaScript finds the text boxes, button, message area, result area, score, and lists. It keeps a reference to each one so it knows where to read and where to write.

The storage key is the name of the small browser drawer where the app saves the unfinished comparison.

### Understanding Skill Names

The `skillCatalog` is a dictionary of familiar skills and their nicknames. For example, `JS` and `JavaScript` are treated as the same skill.

- `normalizeSkill` makes words easier to compare by using lowercase letters, removing extra marks, and cleaning up spaces.
- `parseList` breaks the user's text apart whenever it finds a comma or a new line.
- `canonicalSkillName` changes a nickname into the app's standard name.
- `extractSkills` removes empty entries and duplicates, then returns one clean list.

This means a user can type skills in a relaxed way and still get a fair comparison.

### Showing the Answer

`renderList` clears an old list and creates new list items for the matched or missing skills. It uses `textContent`, which safely treats user input as text instead of accidentally treating it like webpage code.

### Saving and Loading Drafts

- `loadState` looks in browser storage when the page opens. If it finds a good saved draft, it puts the text back into the boxes.
- `saveState` saves both boxes. If the browser refuses to save, it shows an error while leaving the user's typed text alone.

The input event listeners call `saveState` whenever the user types, so an unfinished comparison can survive a page reload.

### Comparing the Skills

`evaluateMatch` does the main job:

1. It cleans the user's skills and the job requirements.
2. It checks that both lists have something in them.
3. It finds which job skills also appear in the user's skills.
4. It finds which job skills are missing.
5. It calculates the percentage using the number of matched job skills divided by the number of unique job skills.
6. It chooses a summary such as strong fit, partial fit, or weak fit.
7. It writes the score and lists onto the page.
8. It saves the current text.

Finally, the button's click listener tells `evaluateMatch` to do all of this when the user presses **Compare fit**.

In short, the HTML makes the stage, the CSS makes the stage look good, and the JavaScript runs the show.
