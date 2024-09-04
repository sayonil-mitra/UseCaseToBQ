1. npm i 
(install dependencies)

2. npm start
(run backend service on port 3000)

3. In Postman:

curl --location 'http://localhost:3000/bq' \
--header 'Content-Type: application/json' \
--data '{
    "schemaId": "66d6ff014006bd33cd1a36ed",
    "useCase": "E commerce website for books"
}'

use Case - give what you want the bq to calculate