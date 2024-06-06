## Endpoints

The base URL for all endpoints is: `https://api.example.com`

### Authentication

#### Register a new user

- **POST /auth/signup**

  Registers a new user with the provided credentials.

  Request Body:

  ```json
  {
    "username": "example_user",
    "email": "user@example.com",
    "password": "password"
  }
  ```

#### Login

- **POST /auth/signup**

Logs in a user with the provided credentials and returns a JWT token.

Request Body:

```json
{
  {
"email": "user@example.com",
"password": "password"

}
```

### Projects

#### List all projects

- **GET /projects**

Retrieves details of all projects.

#### Register Project

- **POST /projects**

Creates a new project.

Request Body:

```json
{
  "title": "New Project",
  "description": "Project description",
  "tags": ["tag1", "tag2"]
}
```

#### Update Project

- **PUT /projects{id}**

Updates details of a project by its ID.

Request Body:

```json
{
  "description": "Updated project description"
}
```

#### Delete Project

- **DELETE /projects**

Deletes a project by its ID.

### Search

- **GET /projects/tags?tags=abc,def,kkk**

  Retrives the project having atleast one of the tags
  tags are sperated by comma (,)
