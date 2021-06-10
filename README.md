### Create controller

```
nest g controller <Controller name>

```

### Create Service

```
nest g service <Service name>

```

### Create module

```
nest g module <Module name>

```

```
src
---cats
-------dto
----------create-cat.dto.ts
-------interfaces
----------cat.interface.ts
-------cats.controller.ts
-------cats.module.ts
-------cats.service.ts
---app.module.ts
---main.ts
```
*Step 1: tạo file env*
### before push - run format all
```
npm run format
```
# Step to run back end 💡
**Step 1: Install mongodb**
    *Với Window [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)*
    *Với Macos [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)*
    *Với Linux [MongoDB](https://docs.mongodb.com/manual/administration/install-on-linux/)*

**Step 2: Dowload Mongo Compass**
*Mongo Compass [Dowload Mongo Compass](https://www.mongodb.com/try/download/compass)*
    Open cmd:
    ```
    mongo
    ```
    ```
    use db_name
    ```
    ```
    db.createUser(
        {
            user: "admin",
            pwd:"DDSQGG46CapstoneProject",
            roles: [
                {
                    role:"root",
                    db:"admin"
                }]
        }
    )
    ```

**Step 3: Create database**
```
DATABASE_NAME=DDSGQ
USERNAME=admin
PASSWORD=DDSQGG46CapstoneProject
HOST=localhost
DB_POST=27017
```

**Step 4: coppy file .env.example to .env**
```
cp .env.example .env
```
**Step 5: run backend**
```
npm start:dev

yarn start:dev
```
