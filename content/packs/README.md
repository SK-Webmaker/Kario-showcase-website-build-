# Packs

One directory per week: `content/packs/YYYY-MM-DD/`, dated the Monday.

    content/packs/2026-08-25/
      pack.json        the posts — captions, dates, provenance, formats
      images/          the rendered assets, named to match each post id
      HANDOVER.md      what the operator opens: image, then caption, in order
      research.md      the links found this week, each one verified to resolve

`pack.json` is the file the Critic reads:

    node tools/critic.mjs content/packs/2026-08-25/pack.json

## pack.json

```json
{
  "week_of": "2026-08-25",
  "posts": [
    {
      "id": "01-thursday-diary",
      "planned_date": "2026-08-27",
      "format": "video | image | carousel",
      "asset_provenance": "product_screenshot | real_photo | operator_video_frame | typographic_card | diagram",
      "asset": "images/01-thursday-diary.png",
      "is_offer": false,
      "testing": "the one variable this post changes, or null",
      "verified_figures": [{ "value": "30%", "source": "https://… (checked to resolve)" }],
      "caption": "The caption exactly as it will be pasted, hashtags included."
    }
  ]
}
```

`verified_figures` is the mechanism behind "never invent a number": any
percentage in a caption must be declared here with a source, or the Critic
fails the post. `asset_provenance` is the mechanism behind the no-AI-photograph
rule — `ai_photo` is refused outright.
