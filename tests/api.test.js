import request from 'supertest';
const baseURL = "localhost:3000/api";

describe("GET/ledger - Basic suite", () => {
    it("should return 200 and return data", async () => {
        const response = await request(baseURL)
            .get("/ledger")
            .query({
                "start_date": "2023-03-28",
                "end_date": "2023-05-27",
                "weekly_rent": "555",
                "frequency": "FORTNIGHTLY",
                "timezone": "America/Los_Angeles"
            });
        expect(response.status).toBe(200);
        expect(response.body.length>=0).toBe(true);
    });
    it("should return 400", async () => {
        const response = await request(baseURL).get("/ledger")
        .query({
            "start_date": "",
            "end_date": "2023-05-27",
            "weekly_rent": "555",
            "frequency": "FORTNIGHTLY",
            "timezone": "America/Los_Angeles"
        }); 
        expect(response.status).toBe(400);
    });
});