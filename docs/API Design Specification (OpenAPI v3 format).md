Minimal OpenAPI (YAML). Save as docs/openapi.yaml. This is a concise spec — expand with schemas for production.

openapi: 3.0.3
info:
  title: DICS API
  version: "0.1.0"
  description: API for Decentralized Insurance Claim Settlement (Aurelia Labs)
servers:
  - url: https://api.example.com/v1
paths:
  /auth/wallet:
    post:
      summary: Wallet-based authentication (sign nonce)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                address:
                  type: string
                signature:
                  type: string
      responses:
        '200':
          description: Authenticated
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string

  /policies:
    get:
      summary: List policies for authenticated wallet
      security:
        - bearerAuth: []
      responses:
        '200':
          description: array of policies
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Policy'

  /claims:
    post:
      summary: Create claim (off-chain meta). Smart contract tx required to submit on-chain.
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateClaim'
      responses:
        '201':
          description: Claim created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ClaimResponse'

    get:
      summary: List claims for user
      security:
        - bearerAuth: []
      responses:
        '200':
          description: claims
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ClaimResponse'

  /claims/{claimId}:
    get:
      summary: Get claim details
      parameters:
        - in: path
          name: claimId
          schema:
            type: integer
          required: true
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Claim
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ClaimResponse'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Policy:
      type: object
      properties:
        policyId:
          type: integer
        contractAddress:
          type: string
        holderAddress:
          type: string
        coverage:
          type: object

    CreateClaim:
      type: object
      required: [policyId, amount, merkleRoot]
      properties:
        policyId:
          type: integer
        amount:
          type: number
        merkleRoot:
          type: string
        metadata:
          type: object

    Document:
      type: object
      properties:
        filename:
          type: string
        cid:
          type: string
        sha256:
          type: string

    ClaimResponse:
      type: object
      properties:
        claimId:
          type: integer
        policyId:
          type: integer
        claimantAddress:
          type: string
        amount:
          type: number
        merkleRoot:
          type: string
        status:
          type: string
        documents:
          type: array
          items:
            $ref: '#/components/schemas/Document'
        events:
          type: array
          items:
            type: object


Notes:

Implement JWT or session tokens post wallet-signature verification.
Expand with error responses, pagination, sorting, and rate-limiting headers.