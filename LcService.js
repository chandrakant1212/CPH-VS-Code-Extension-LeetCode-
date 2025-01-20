const axios = require('axios');
const cheerio = require('cheerio');
const BASE_URL = 'https://alfa-leetcode-api.onrender.com';

class LcService {
    async getDetails(slug) {
        try {
            const res = await axios.get(`${BASE_URL}/select?titleSlug=${slug}`);
            return res.data;
        } catch (err) {
            throw new Error(`Failed to fetch details: ${err.message}`);
        }
    }

    extractTests(data) {
        const $ = cheerio.load(data.question);
        const examples = [];

        $('pre').each((idx, el) => {
            const text = $(el).text().trim();
            const inMatch = text.match(/Input:\s*(.*)/);
            const outMatch = text.match(/Output:\s*(.*)/);
            const explMatch = text.match(/Explanation:\s*(.*)/);

            if (inMatch && outMatch) {
                examples.push({
                    input: inMatch[1],
                    output: outMatch[1],
                    explanation: explMatch ? explMatch[1] : '',
                    testCaseNum: (examples.length + 1)
                });
            }
        });

        return examples.map((ex, idx) => ({
            input: ex.input,
            output: ex.output,
            explanation: ex.explanation,
            testCaseNum: idx + 1
        }));
    }
}

module.exports = LcService;