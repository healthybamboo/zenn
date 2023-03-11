module.exports = {
    plugins: {
      "@textlint/markdown": {
        extensions: [".md"],
      },
    },
    rules: {
      "preset-ja-technical-writing":{
        "max-ten": {
            "max": 4,
        },
      },
      "preset-jtf-style": {
        "2.2.1.ひらがなと漢字の使い分け": true,
      },
    },
    prh: { rulePaths: ["./prh.yml"] },
    filters: {
        comments: true,
      },
  };