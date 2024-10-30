# Green Stormwater Infrastructure Project

This project is developed using the SeaSketch Geoprocessing Framework to create geoprocessing functions, report clients, and UI components.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Developing a Geoprocessing Function](#developing-a-geoprocessing-function)
- [Creating a Report Client](#creating-a-report-client)
- [Creating a UI Component](#creating-a-ui-component)
- [Publishing](#publishing)
- [Mapping the Geoprocessing Report Client on SeaSketch Dashboard](#mapping-the-geoprocessing-report-client-on-seasketch-dashboard)
- [User Sketch](#user-sketch)

## Overview

The project includes the following key features:
- Geoprocessing functions to perform spatial analysis.
- Report clients to fetch and display results on the SeaSketch platform.
- UI components to organize and present the results in a user-friendly way.

## Setup

### Prerequisites

- **Node.js** (v14 or later)
- **npm** (v6 or later)
- **SeaSketch Geoprocessing Framework**

### Installation

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd green-stormwater-infrastructure
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

## Developing a Geoprocessing Function

1. **Create a new geoprocessing function**:
    ```bash
    npm run create:function
    ```
    Follow the prompts to provide the function name, description, and other details.

2. **Implement the function logic** in `src/functions/<your-function-name>.ts`

3. **Test the function** using the provided smoke test or by running:
    ```bash
    npm test
    ```

## Creating a Report Client

1. **Create a new report client**:
    ```bash
    npm run create:client
    ```
    Provide the client name, description, and associated geoprocessing function.

2. **Implement the report client** in `src/clients/<your-client-name>.tsx`

3. **Update project configuration** in `project/geoprocessing.json` to include the new client

## Creating a UI Component

1. **Create a new card component** in `src/components/<your-card-name>.tsx`.

2. **Organize cards in a page component**

## Publishing

1. **Build and deploy** the project:
    ```bash
    npm run build
    npm run deploy
    ```

## Mapping the geoprocessing report client on SeaSketch Dashboard

1. **Go to** https://www.seasketch.org/<your-seasketch-project-name>/admin/sketching
2. **Under Geoprocessing tab, enter the service endpoint and choose the report client**

## User sketch

1. **Sketch using the sketch class that has geoprocessing function linked to it**
2. **Right click on the sketch and view report**

