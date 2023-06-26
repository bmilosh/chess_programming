# Chess Programming Using Bitboard Representation

This repo hosts my chess web app built with Python (Django) backend and React frontend. I built the chess engine powering the applicaiton in Python following the [Bitboard CHESS ENGINE in C](https://www.youtube.com/playlist?list=PLmN0neTso3Jxh8ZIylk74JpwfiWNI76Cs) video series. The application is bundled with webpack and compiled with Babel.

You can have a go at playing aginst the computer [here](https://mb-chess-fcb92b9ccc46.herokuapp.com). However, for anyone interested in running it locally, please follow the below instructions carefully.

## Setup Instructions

### Prerequisites

- Python 3.x installed (https://www.python.org/downloads/). While Python 3.11 was employed in creating the backend application, Python 3.10 should suffice.
- Node.js and npm installed (https://nodejs.org/)

In case there's a problem with the second step above for unix, macOS or windows WSL machines, the following might work (sourced from [here](https://cloudbytes.dev/snippets/how-to-install-nodejs-and-npm-on-wsl2)).

1. Install the latest verison of the Node Version Manager (NVM):

    ```shell
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    ```
    or 
    ```shell
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    ```
    Check [the NVM GitHub repo](https://github.com/nvm-sh/nvm#installing-and-updating) to get the latest version of the above command.

2. Run the following command:

    ```shell
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    ```

3. Confirm installation of NVM by running the following:

    ```shell
    nvm --version
    ```

4. Fetch all versions available in NVM:

    ```shell
    nvm ls-remote
    ```

5. Install the latest version of both Node.js and npm:

    ```shell
    nvm install node
    ```

6. Confirm they were correctly installed:

    ```shell
    node --version
    ```

    and

    ```shell
    npm --version
    ```

### Backend Setup (Python/Django)

1. Clone the repository:

   ```shell
   git clone https://github.com/bmilosh/chess_programming.git
   ```

2. If you are not in the root directory, navigate there:

   ```shell
   cd chess_programming
   ```

3. Create and activate a virtual environment:

   - **Windows**:

     ```shell
     python -m venv venv
     venv\Scripts\activate
     ```

   - **Linux**:

     ```shell
     python3 -m venv venv
     source venv/bin/activate
     ```

4. Install the required Python packages:

   ```shell
   pip install -r requirements.txt
   ```

5. Set up environment variables:

   - Create a `.env` file in the project root directory.
   - Define the following environment variables in the `.env` file:

     ```
     DJANGO_SECRET_KEY=your_django_secret_key
     DJANGO_DEBUG_ON="True"  # This is the default setting for development mode.
     ```

     Replace `your_django_secret_key` with a secure secret key. You can generate a new secret key by running the following command in the project root directory:

     ```shell
     python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
     ```

6. Run database migrations:

   ```shell
   python manage.py migrate
   ```

### Frontend Setup (ReactJS)

1. If you are not in the root directory, navigate there:

   ```shell
   cd chess_programming
   ```

2. Install the required npm packages:

   ```shell
   npm install
   ```

3. Start the development server:

   ```shell
   npm run dev
   ```

### Start Application
1. Start the Django development server:

   ```shell
   python manage.py runserver
   ```

   If the previous steps went well, the application should now be accessible at `http://localhost:8000`.

## To-Do

- Detect three-fold repetitions.
- Add ability to create users.
- Add ability for human-to-human games.