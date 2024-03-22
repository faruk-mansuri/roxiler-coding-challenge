
# Roxiler Coding Challenge




## Tech Stack

**Client:** React, TailwindCSS, Shadcn-ui, recharts

**Server:** Node, Express, mongoose


## API Reference

#### Initialize database with seed data

```http
  POST /api/v1/products
```

#### Get item

```http
  GET /api/v1/products/:month
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `month`      | `string` | **Required**. month for filtering products. |
| `searchTerm`| `string` | Optional. Search term for filtering products. |
| `page`      | `string` | Optional. Page number for pagination. |

#### Get statistics

```http
  GET /api/v1/products/statistics/:month
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `month`      | `string` | **Required**. month for getting stats details. |


#### Get bar chart

```http
  GET /api/v1/products/bar-chart/:month
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `month`      | `string` | **Required**. month for getting bar-chat details. |


#### Get pie chart

```http
  GET /api/v1/products/pie-chart/:month
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `month`      | `string` | **Required**. month for getting pie-chat details. |


#### Get all stats usign single api

```http
  GET /api/v1/products/all-stats/:month
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `month`      | `string` | **Required**. month for getting stats details. |


## Run Locally

Clone the project

```bash
  git clone https://github.com/faruk-mansuri/roxiler-coding-challenge
```

Go to the project directory

```bash
  cd roxiler-coding-challenge
```

Install dependencies

```bash
  npm run setup-production-app
```

Start the server

```bash
  nodemon server
```
## live project 
https://roxiler-coding-challenge.onrender.com

copy and paste above link in your browser (this will take 10-20 seconds for initial load)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the root of project (backend)

`MONGO_URL`=mongodb+srv://faruk13:faruk13@cluster0.bkbx6ew.mongodb.net/ROXILER_SYSTEMS_CODDING_CHALLENGE?retryWrites=true&w=majority&appName=Cluster0

`PORT`=5000


