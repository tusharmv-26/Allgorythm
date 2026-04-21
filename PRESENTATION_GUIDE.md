# SentinelMesh Official Pitch Script & Demo Flow

> [!TIP]
> Keep this open on your phone or a secondary screen while presenting. Read the **"Narrative"** out loud to the judges, and follow the **"Action"** steps to progress the live demonstration.
> 
> **Prerequisites before judges arrive:**
> - Laptop 1 (Defender): Has the React Dashboard open on `localhost:5173`.
> - Laptop 2 (Attacker): Has a terminal open ready to execute `curl` commands (or PowerShell `Invoke-RestMethod`).

---

## ACT 1: The Initial Probe (Feature: Live S3 Cloud Pipeline & IP Enrichment)

**Narrative (Say to Judges):**
*"A massive problem in Cloud Security is alert fatigue. We get thousands of pings a day, and we don't know who is a script-kiddie and who is an Advanced Persistent Threat (APT). SentinelMesh doesn't just block IPs—it lets them into a deceptive layer (the 'Mesh') to build a psychological profile on them.* 

*Watch as an attacker attempts to exfiltrate or tamper with a real asset in our AWS environment. This isn't a simulation—this is a live AWS S3 bucket hardwired to our AI engine."*

**Action (Attacker Laptop):**
1. Create a fake file on the desktop called `stolen_data.zip` or `ransomware.sh`.
2. Open the AWS S3 Console (for your honeypot bucket `payment-gateway-prod-backups-2026`).
3. Click "Upload" and drag-and-drop the fake file into the bucket.
*(Alternatively, execute `aws s3 cp ransomware.sh s3://payment-gateway-prod-backups-2026/` from the attacker terminal).*

**Show Judges (Defender Dashboard):**
- Point to the **Live Events** feed as it flashes. Emphasize: *"The moment that file touched the S3 bucket, it triggered Amazon SNS, woke up our AWS Lambda Processor, and forwarded the telemetry straight to our EC2 Analysis Engine."*
- Click the **"Attacker Intelligence"** tab.
- Point to the newly formed card. Point out that the system instantly extracted the attacker's public IP from the AWS event, enriched it, and cross-referenced it against global dark-web registries to flag it as a **"TOR EXIT NODE"**.
- Explain that the Risk is still Medium, because a single interaction could just be a generalized bot. Our AI is waiting to deduce their true intent.

---

## ACT 2: The Escalation (Feature: Behavioral Profiling)

**Narrative (Say to Judges):**
*"The attacker didn't find what they were looking for, so they start aggressively hunting for developer credentials. Watch how our AI catches their behavioral shift in real-time without relying on static rules."*

**Action (Attacker Laptop):**
Fire these two attacks back-to-back:
```bash
curl -X POST http://13.61.240.101:8000/events -H "Content-Type: application/json" -d '{"attacker_ip": "185.220.101.47", "resource_name": "employee-admin-auth", "method": "GET"}'

curl -X POST http://13.61.240.101:8000/events -H "Content-Type: application/json" -d '{"attacker_ip": "185.220.101.47", "resource_name": "production-secret-keys", "method": "GET"}'
```

**Show Judges (Defender Dashboard):**
- Keep pointing at the **Attacker Intelligence** tab.
- Show them the **Escalation Probability bar** violently spiking to 60+%.
- Show them the "Intent" badge dynamically switching to **"CREDENTIAL HARVESTING"**.
- Point to the "Attack Pathway" array at the bottom of the card, showing the exact forensic trail the hacker is tracing through the architecture.

---

## ACT 3: The Threat Threshold & Autonomous Healing (Feature: AI Auto-Lockdown)

**Narrative (Say to Judges):**
*"The attacker has reached our critical Risk Threshold (≥ 70). Standard security tools would just send a passive alert to a Slack channel and wait for an engineer to wake up. By the time a human logs in, the data is already gone.* 

*Watch what an Autonomous Security Operations Center does. SentinelMesh evaluates the semantic intent of the attacker, identifies which real production AWS EC2 server is most similar to the decoy they are attacking, and autonomously revokes all inbound security group access to save the real infrastructure—in under 1 second."*

**Action (Attacker Laptop):**
Throw the final breach command simulating an attack on a highly sensitive target:
```bash
curl -X POST http://13.61.240.101:8000/events -H "Content-Type: application/json" -d "{\"attacker_ip\": \"185.220.101.47\", \"resource_name\": \"mock-app-backend-live\", \"method\": \"GET\"}"
```

**Show Judges (Defender Dashboard):**
- Switch to the **Dashboard Home**. Point to the glowing red Risk Assessment (90/100).
- Point out the **Auto-Heals Counter** which precisely increments.
- Under the **Audit Log / Remediation Pane**, read the clear, human-readable sentence generated live by **Groq Llama-3**. Explain: *"Our AI LLM investigated the telemetry and translated the firewall lockdown into a boardroom-ready explanation so non-technical executives understand exactly what action the system took."*

---

## ACT 4: The Deception (Feature: Honeypot Mutation Engine)

**Narrative (Say to Judges):**
*"But an advanced hacker doesn't stop just because they were blocked—they just rotate their IP and try again. So we do not just block them; we deceive them.* 

*In the exact same millisecond that SentinelMesh healed the live server, it launched a countermeasure. Since our Profiler knew the hacker was hunting for credentials, AWS automatically orchestrated a brand new, fake infrastructure environment specifically designed to distract them."*

**Action (No command needed - happens simultaneously with Act 3)**

**Show Judges (Defender Dashboard):**
- Point to the very bottom of the **Live Events** feed. 
- Highlight the purple 🕸️ **AUTONOMOUS HONEYPOT DEPLOYED** badge. 
- Emphasize: *"The AI dynamically generated an SSH-keys backup server that doesn't actually exist, purely to tie the hacker up in a wild goose chase while our real servers remain safe."*

---

## ACT 5: The Hunt (Feature: Canary Tokens)

**Narrative (Say to Judges):**
*"What if the attacker successfully stole a configuration file before we blocked them? Usually, they disconnect from the internet, open the file, and analyze it safely on their local machine where cloud tools can't see them.*

*We solved this. SentinelMesh injects stealth webhooks called 'Canary Tokens' directly inside our fake documents. When the attacker opens the stolen file on their laptop, it detonates and phones home."*

**Action (Attacker Laptop):**
Open any Web Browser on the attacker laptop (Chrome, Edge) and paste this URL into the search bar:
`http://13.61.240.101:8000/canary/track?token=ab937-2910-cdea-f19b`

**Show Judges (Defender Dashboard):**
- Point to the **Live Events** feed again.
- A massive, thick Red Alert bar will violently inject itself into the feed. 
- Emphasize to the judges that the IP address shown on screen now is NO LONGER the Tor relay IP—it has completely bypassed the VPN and extracted the hacker's true residential IP and Browser Engine!

---

## ACT 6: Handover (Feature: Automated PDF Forensics)

**Narrative (Say to Judges):**
*"The threat is neutralized, isolated, and tracked down to a physical residential IP. The last step in an incident response lifecycle is handing over the forensics to the FBI or Cybersecurity authorities. Writing those reports takes analysts 12 hours. Watch."*

**Action (Defender Laptop):**
- Go back to the **Attacker Intelligence** tab.
- Click the glowing cyan **"📥 GENERATE FORENSIC PDF REPORT"** button.

**Show Judges (Defender Dashboard):**
- Open the downloaded PDF. 
- Scroll through the document, showing the Groq-generated Executive incident abstract, the threat matrix, and the absolute timeline of every single movement the hacker made.

*"And that is SentinelMesh—an entire autonomous Security Operations Center orchestrated by AI."*
