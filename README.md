<div align="center">

# `rohith.` — a portfolio that behaves like a model

```python
>>> model = RohithSingh.from_pretrained("kgrcet/btech-aiml-2027")
>>> model.generate()
```

### **[▶ See it live: rohithsing.github.io/my-portfolio](https://rohithsing.github.io/my-portfolio/)**

Final-year B.Tech CSE (AI & ML) student in Hyderabad · IEEE CCIC 2026 co-author · open to AI/ML, GenAI and data roles

[Live site](https://rohithsing.github.io/my-portfolio/) · [GitHub](https://github.com/rohithsing) · [LinkedIn](https://linkedin.com/in/rohithsing) · [Résumé](assets/Rohith_Singh_Resume.pdf) · [IEEE paper](https://ieeexplore.ieee.org/document/11486116)

</div>

---

Most portfolios are a list of things someone has built. This one lets you **play with them**. Every section borrows an idea from machine learning and turns it into something you can click, drag, or break.

## 🌡️ One slider controls the whole site

At the top there's a **temperature** slider, like the one that controls how random a language model's output is:

| Temperature | Mode | What you get |
|---|---|---|
| `0.0` | **formal** | Short and to the point. Recruiter mode. |
| `0.7` | **balanced** | The default. |
| `2.0` | **playful** | Jokes, emoji, and a chatbot that asks for chai. |

Moving it rewrites the copy on the page, changes how the "describe me" sampler picks words, sets the voice of the contact chat, and adds noise to the name in the hero.

## 🧭 Tour

| # | Section | ML idea | What you can do |
|---|---|---|---|
| 00 | **Hero** | Diffusion | My name is drawn by reverse diffusion, step by step from `t = 1000`. Move your cursor across it to add noise back. |
| 01 | **model_card** | Next-token sampling | A tiny language model describes me one word at a time. Pick the next word yourself, or press *sample* and let the temperature decide. |
| 02 | **embed(projects)** | Live inference | Each project comes with a small working toy (see below). |
| 03 | **loss.backward()** | Backprop | Experience and skills are drawn as a neural network. Hover a skill and its gradient flows back to every project that used it. Scroll, and each role runs forward into its skills. |
| 04 | **path** | Training run | A timeline of how I got here. |
| 05 | **Checkpoints** | Saved weights | 14 certificates. Each card takes its issuer's colour on hover and opens in a viewer with the PDF and a verification link. |
| 06 | **talk** | Chat model | A small scripted assistant asks your name and why you're here, then writes a first message you can edit and send by email or WhatsApp. |

## 🧪 Projects with toys you can play with

| Project | Toy on the site | Result | Links |
|---|---|---|---|
| **Automated Personality Assessment** (XGBoost + SMOTE) | Drag the dots and watch the predicted Big Five type change | **89.54%** accuracy, published on IEEE Xplore | [paper](https://ieeexplore.ieee.org/document/11486116) · [code](https://github.com/rohithsing/personality-assessment-system) |
| **5G/6G Spectrum Allocation** (Dueling Double DQN) | Park a licensed user on a channel and watch the RL agent avoid it while a fixed scheduler collides | **0.0%** collisions, up to **+40%** throughput | [demo](https://5g-spectrum-simulator.streamlit.app/) · [code](https://github.com/rohithsing/5g-spectrum-simulator) |
| **X-Ray Enhancement** (modified ESRGAN) | Drag a slider from the low-res input to the GAN output | **34.77 dB** PSNR · **0.926** SSIM | [code](https://github.com/rohithsing/X-Ray-Enhancement) |
| **Cognify** (LLMs + diffusion) | Pick a topic and a level to get a learning track | Adaptive learning platform | [live](https://cognify.ourspaces.net/) · [code](https://github.com/rohithsing/Cognify) |
| **Chiron AI** (Groq LLM) | Tap a question to ask the health assistant | Symptom and drug-interaction checker | [live](https://chiron-ai.onrender.com/) · [code](https://github.com/rohithsing/Chiron-AI) |

Press **trace skills ↓** under any project to jump down to the network and watch that project run forward into the skills it used.

## 🛠️ Built with

No framework, no build step, no dependencies. Just:

- **HTML** in one `index.html`
- **CSS** in `css/style.css`, with light and dark themes
- **Vanilla JavaScript** plus `<canvas>` and SVG
  - `js/app.js` runs the temperature system, the hero diffusion, the sampler, the project toys, the certificate viewer and the chat
  - `js/network.js` runs the neural-network view of experience and skills; its wires are re-routed from live element positions every frame
- Fonts: Instrument Serif, Inter Tight and JetBrains Mono

Canvas toys share one animation loop and pause when they scroll off-screen. The site also respects `prefers-reduced-motion`.

## 📬 Say hi

The quickest way is the chat at the bottom of the [live site](https://rohithsing.github.io/my-portfolio/#talk). It writes the first message for you.

<div align="center">

<sub>Trained on real, messy data. Fine-tuned with chai. ☕</sub>

</div>
