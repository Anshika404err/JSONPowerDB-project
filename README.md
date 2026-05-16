# JSONPowerDB-project
Creating a Shipment form using JSONPowerDB
# Shipment Management System

## Description
The **Shipment Management System** is a lightweight, high-performance web application designed to handle logistics tracking records effortlessly. Built with a clean interface, it allows real-time data lookups, entry generation, and modifications for delivery data points. 

The application establishes a real-time key-value connection to a cloud database cluster to keep logistics information synchronized without requiring bulky backend frameworks.

## WORKING[[Examples of Use]]
1)Testing the API using Talend API Tester
<img width="1513" height="780" alt="image" src="https://github.com/user-attachments/assets/0f99848c-a947-40bb-9f5e-b43b1f91a5de" />
<img width="1356" height="620" alt="image" src="https://github.com/user-attachments/assets/957c727e-916c-4405-a7d6-1f43b7a1bedf" />
2)Saving,Changing,Reseting data using Shipment form 
<img width="563" height="593" alt="image" src="https://github.com/user-attachments/assets/d944685a-3a3b-463a-8c2e-edccfc4dc160" />
<img width="1290" height="601" alt="image" src="https://github.com/user-attachments/assets/14526825-fa7d-4e58-875e-be6c662aa537" />

---

## 📋 Table of Contents
1. [Benefits of using JsonPowerDB](#benefits-of-using-jsonpowerdb)
2. [Scope of Functionalities](#scope-of-functionalities)
3. [Database Configuration](#database-configuration)
4. [Illustrations](#illustrations)
---

## Benefits of using JsonPowerDB

This project leverages **JsonPowerDB (JPDB)** by Login2Explore due to its unique features over traditional relational or document databases:

* **Real-time Engine**: Built on top of a specialized high-performance engine that merges the speed of an In-Memory database with the reliability of a persistent data store.
* **Serverless Architecture**: Eliminates the need to maintain web app controllers, custom server API routers, or object-relational mapping (ORM) setups.
* **Schema-less & Document-Centric**: Accepts clean JSON payloads natively, making schema transitions fast and flexible.
* **REST API Driven**: Complete database interaction (Retrieval and Manipulation) takes place via structured HTTP AJAX requests natively out-of-the-box.

---

## Scope of Functionalities

* **Dynamic Field State Control**: Automatically opens and closes input availability depending on whether a Shipment key is new or historically recorded.
* **Automatic Record Lookups**: Fires instantly upon a change event on the primary key to query the database and pull relevant records into the interface.
* **Chronological Rule Checking**: Evaluates date logic via text handlers before pushing objects to the server, protecting records from data conflict anomalies.
* **Multi-Mode Saving Stack**: Includes options to cleanly persist completely fresh records (`PUT`) or overwrite modified variables (`UPDATE`).

---

## Database Configuration

The integration hooks use the following infrastructure specifications:
* **Database Target**: `DELIVERY-DB`
* **Relation Target**: `SHIPMENT-TABLE`
* **Active Base URL**: `http://api.login2explore.com:5577`

---

## Illustrations

### Application State & Form Workflow

```text
       [ User Enters Shipment No. ]
                   │
                   ▼
     [ Triggers getShipment() via IRL ]
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
   Status = 400        Status = 200
  (New Shipment)     (Record Exists)
         │                   │
         ▼                   ▼
 Unlock All Fields     Fetch Data Payload
         │                   │
         ▼                   ▼
   Enable [Save]       Populate Form Inputs
                       Unlock Fields for Edit
                             │
                             ▼
                       Enable [Change]
