"use strict";
import request from 'supertest';
const baseURL = "http://ec2-13-235-76-19.ap-south-1.compute.amazonaws.com:3000/api";

//I havent mocked the API calls, directly using the API. will do as the next step.

describe("GET/ledger - Basic suite", () => {
    it("Normal request", async () => {
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
        expect(response.body.length >= 0).toBe(true);
    });
    it("Empty string for start_date - ", async () => {
        const response = await request(baseURL).get("/ledger")
            .query({
                "start_date": "",
                "end_date": "2023-05-27",
                "weekly_rent": "555",
                "frequency": "FORTNIGHTLY",
                "timezone": "America/Los_Angeles"
            });
        expect(response.status).toBe(400);
        console.log("Empty string for start_date - " + response.text);
    });
    it("end_date not in UTC format", async () => {
        const response = await request(baseURL).get("/ledger")
            .query({
                "start_date": "2023-03-28",
                "end_date": "18-05-2023",
                "weekly_rent": "555",
                "frequency": "FORTNIGHTLY",
                "timezone": "America/Los_Angeles"
            });
        expect(response.status).toBe(400);
        console.log("end_date not in UTC format - " + response.text);
    });
    it("start_date cannot be greater than end_date", async () => {
        const response = await request(baseURL)
            .get("/ledger")
            .query({
                "start_date": "2024-03-28",
                "end_date": "2023-05-27",
                "weekly_rent": "555",
                "frequency": "FORTNIGHTLY",
                "timezone": "America/Los_Angeles"
            });
        expect(response.status).toBe(400);
        console.log("start_date cannot be greater than end_date - " + response.text);
    });
    it("Negative week_rent", async () => {
        const response = await request(baseURL).get("/ledger")
            .query({
                "start_date": "2023-03-28",
                "end_date": "2023-05-27",
                "weekly_rent": "-50",
                "frequency": "FORTNIGHTLY",
                "timezone": "America/Los_Angeles"
            });
        expect(response.status).toBe(400);
        console.log("Negative week_rent - " + response.text);
    });
    it("Invalid frequency", async () => {
        const response = await request(baseURL).get("/ledger")
            .query({
                "start_date": "2023-03-28",
                "end_date": "2023-05-27",
                "weekly_rent": "555",
                "frequency": "YEARLY",
                "timezone": "America/Los_Angeles"
            });
        expect(response.status).toBe(400);
        console.log("Invalid frequency - " + response.text);
    });
    it("Invalid timezone", async () => {
        const response = await request(baseURL).get("/ledger")
            .query({
                "start_date": "2023-03-28",
                "end_date": "2023-05-27",
                "weekly_rent": "555",
                "frequency": "MONTHLY",
                "timezone": "America/LosAngeles"
            });
        expect(response.status).toBe(400);
        console.log("Invalid timezone - " + response.text);
    });
});