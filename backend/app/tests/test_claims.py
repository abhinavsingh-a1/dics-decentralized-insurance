def test_create_claim_requires_auth(client):
    # no auth header
    payload = {"policy_id": 1, "amount": 100.0, "merkle_root": "0xabc"}
    res = client.post("/claims", json=payload)
    assert res.status_code == 401
