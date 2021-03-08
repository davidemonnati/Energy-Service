#!/bin/bash

ROOT_DIR=$PWD

readonly GREEN='\033[0;32m'
readonly YELLOW='\033[0;33m'
readonly RED='\033[0;31m'
readonly BLUE='\033[0;34m'
readonly LIGHTBLUE='\033[1;34m'
readonly NC='\033[0m' # No Color

main() {
    say_hello

    if ! is_in_correct_dir; then
        echo -e "${RED}ERRORE:${NC} Non ti trovi nella directory del progetto
            E' possibile effettuare il download eseguendo il comando $0 -c.\n"
        echo -e "Per consultare la guida utilizzare l'opzione -h\n"
            exit 1
    fi

    if check_config_files; then
        echo -e "${RED}ERRORE:${NC} Non è possibile continuare la build del progetto"
        echo -e "Controllare le configurazioni e variabili d'ambiente e rieseguire lo script.\n"
        exit 1
    fi

    cd $ROOT_DIR
    search_pkg node
    search_pkg ng
    search_pkg jq
    search_pkg mosquitto

    build_backend
    build_frontend
    build_mqttstorage
    
    create_backend_daemon
    create_mqttstorage_daemon
    create_frontend_daemon
    
    enable_all_daemons
    start_all_daemons

    echo -e "\n${GREEN}Build del progetto completata correttamente!${NC}\n"
}

show_help() {
    echo -e "Usage: $0 [OPZIONE]"
    echo -e "Script per il deploy automatico di Energy-Service\n"
    echo -e "\tOptions:\n"
    echo -e "\t -c  \t\tclona il repo github di Energy-Service.
                        Una volta terminata la copia eseguire questo script all'interno della root principale di Energy-Service."
    echo -e "\t -D  \t\tdisabilita tutti i servizi"
    echo -e "\t -h  \t\tvisualizza questo messaggio"
    echo -e "\t -r  \t\tripristina tutti i file del progetto dalla repository"
    echo -e "\t -R  \t\tesegue la rimozione di Energy-Service"
    echo -e "\t -s  \t\tavvia tutti i servizi"
}

clone_repo() {
    search_pkg git
    git clone https://github.com/davidemonnati/Energy-Service
    echo -e "\n${YELLOW}Clone del repository terminato, ora puoi eseguire questo script all'interno della root del progetto Energy-Service${NC}\n"
}

restore_file() {
    search_pkg git
    echo -e "Ripristino dei dei file in corso..."
    git checkout .
    echo -e "Ripristino completato."
}

say_hello() {
    echo -e "\n${LIGHTBLUE}Benvenuti in Energy-Service, questo script vi guiderà nel building guidato del progetto!\n\n${NC}"
}

is_in_correct_dir() {
    if [ -d "backend" ] && [ -d "frontend" ] && [ -d "mqtt-storage" ]; then
        return 0;
    fi
    return 1;  
}

check_config_files() {
    # Controllo file di configurazione
    NOT_FOUND=false;
    echo -e "Sto controllando se sono presenti tutti i file di configurazione e variabili d'ambiente...\n"
    cd backend
    if [ ! -f "ormconfig.json" ]; then
        echo -e "${RED}ERRORE:${NC} Il file di confugurazione ormconfig.json non è presente all'interno della cartella backend
        Per maggiori info visitare: ${BLUE}https://gist.github.com/davidemonnati/29fe8c80b371a60caec7aab0f07655f2\n${NC}"
        NOT_FOUND=true
    else
        echo -e "  ${LIGHTBLUE}->${NC} backend/ormconfig.json -> [${GREEN}OK${NC}]"
    fi

    if [ ! -f "ServiceAccountKey.json" ]; then
        echo -e "${RED}ERRORE:${NC} Il file ServiceAccountKey.json non è presente all'interno della cartella backend
        Per maggiori informazioni visitare il sito ${BLUE}https://firebase.google.com/docs/admin/setup${NC}\n"
        NOT_FOUND=true
    else
        echo -e "  ${LIGHTBLUE}->${NC} backend/ServiceAccountKey.json -> [${GREEN}OK${NC}]"
    fi

    cd ../frontend/src

    # Da controllare e sistemare
    if [ ! -f "environments/environment.prod.ts" ]; then
        echo -e "${RED}ERRORE:${NC} Non sono presenti le variabili d'ambiente nella cartella $PWD/frontend/src/environments
        E' necessario creare il file 'environment.prod.ts' strutturato nel seguente modo:
        ${BLUE}https://gist.github.com/davidemonnati/4e4660e8a69b82ef02ee5b435a50d75c${NC}\n"
        NOT_FOUND=true
    else
        echo -e "  ${LIGHTBLUE}->${NC} frontend/src/environments/environment.prod.ts -> [${GREEN}OK${NC}]\n"
    fi

    if [ "$NOT_FOUND" = true ]; then return 0; else return 1; fi
}

confirm_installation() {
    echo -e "${YELLOW}ATTENZIONE:${NC} $1 non è stato trovato all'interno del sistema."
    read -p "Vuoi aggiungerlo? [S/n]: " -n 1 -r
    echo -e "\n"
    if [[ $REPLY =~ ^[Ss]$ ]]; then return 0; else return 1; fi
}

search_pkg() {
    echo -e "Controllo se $1 è installato nel sistema\n"

    if [ -x "$(command -v pacman)" ]; then
        if [ ! -x "$(command -v $1)" ]; then
            if confirm_installation $1; then
                case $1 in
                node)
                    sudo pacman -Sy nodejs npm
                    ;;
                git)
                    sudo pacman -Sy git
                    ;;
                jq)
                    sudo pacman -Sy jq
                    ;;
                ng)
                    sudo npm install -g @angular/cli
                    ;;
                mosquitto)
                    sudo pacman -Sy mosquitto
                    sudo systemctl enable mosquitto
                    sudo systemctl start mosquitto
                    ;;
                esac
            fi           
        fi
    elif [ -x "$(command -v apt)" ]; then
        if [ ! -x "$(command -v $1)" ]; then
            if confirm_installation $1; then
                case $1 in
                node)
                    sudo apt install -y curl
                    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                    sudo apt install -y nodejs
                    ;;
                git)
                    sudo apt install -y git
                    ;;
                jq)
                    sudo apt install -y jq
                    ;;
                ng)
                    sudo npm install -g @angular/cli
                    ;;
                mosquitto)
                    sudo apt install -y mosquitto
                    sudo systemctl enable mosquitto
                    sudo systemctl start mosquitto
                    ;;
                esac
            fi           
        fi
    elif [ -x "$(command -v dnf)" ]; then
        if [ ! -x "$(command -v $1)" ]; then
            if confirm_installation $1; then
                case $1 in
                node)
                    sudo dnf module install nodejs:12
                    ;;
                git)
                    sudo dnf install git
                    ;;
                jq)
                    sudo dnf install jq
                    ;;
                ng)
                    sudo npm install -g @angular/cli
                    ;;
                mosquitto)
                    sudo dnf install -y mosquitto
                    sudo systemctl enable mosquitto
                    sudo systemctl start mosquitto
                    ;;
                esac
            fi
        fi
    else
        echo -e "${YELLOW}ATTENZIONE:${NC} Impossibile trovare il package manager in uso. Lo script non verrà interrotto ma è possibile che 
            il pacchetto non sia installato nel sistema e il processo terminerà.
            Per risolvere il problema si prega di installare $1"
    fi
}

build_backend() {
    echo -e "\n${GREEN}Starting building backend${NC}"
    cd backend
    npm install --save && npm run tsc
    cd ..
}

build_frontend() {
    echo -e "\n${GREEN}Starting building frontend${NC}"
    cd frontend
    npm install --save && ng build --prod
    cd ..
}

build_mqttstorage() {
    echo -e "\n${GREEN}Starting building mqtt-storage${NC}"
    cd mqtt-storage
    npm install --save && npm run tsc
    cd ..
}

create_backend_daemon() {
    printf "  ${LIGHTBLUE}->${NC} Creazione e configurazione demone per il backend"
    TYPE=$(cat backend/ormconfig.json | jq -r .type)
    HOST=$(cat backend/ormconfig.json | jq -r .host)
    PORT=$(cat backend/ormconfig.json | jq -r .port)
    USERNAME=$(cat backend/ormconfig.json | jq -r .username)
    PASSWORD=$(cat backend/ormconfig.json | jq -r .password)
    DATABASE=$(cat backend/ormconfig.json | jq -r .database)
    printf "[Unit]\nDescription=Energy Service backend server\n\n[Service]\n\
ExecStart=/usr/bin/node $ROOT_DIR/backend/build/app.js\n\
Restart=always\nRestartSec=10\nStandardOutput=syslog\nEnvironment= TYPEORM_CONNECTION=$TYPE \
TYPEORM_HOST=$HOST TYPEORM_USERNAME=$USERNAME TYPEORM_PASSWORD=$PASSWORD TYPEORM_DATABASE=$DATABASE \
TYPEORM_PORT=$PORT TYPEORM_SYNCHRONIZE=true TYPEORM_LOGGING=true \
TYPEORM_ENTITIES=$ROOT_DIR/backend/build/entities//*.js\n\n\
[Install]\nWantedBy=multi-user.target" \
    | sudo tee /etc/systemd/system/backend.service > /dev/null
    printf " -> [${GREEN}OK${NC}]\n"
}

create_mqttstorage_daemon() {
    printf "  ${LIGHTBLUE}->${NC} Creazione e configurazione demone per mqtt storage service"
    printf "[Unit]\nDescription=Energy Service mqtt storage service\n\n[Service]\n\
ExecStart=/usr/bin/node $ROOT_DIR/mqtt-storage/build/app.js\nRestart=always\n\
RestartSec=10\nStandardOutput=syslog\n\n[Install]\nWantedBy=multi-user.target" \
    | sudo tee /etc/systemd/system/mqtt-storage.service > /dev/null
    printf " -> [${GREEN}OK${NC}]\n"
}

create_frontend_daemon() {
    printf "  ${LIGHTBLUE}->${NC} Creazione e configurazione demone per il frontend"
    printf "[Unit]\nDescription=Energy Service frontend server\n\n[Service]\n\
ExecStart=/usr/bin/node $ROOT_DIR/frontend/server.js\nRestart=always\nRestartSec=10\n\
StandardOutput=syslog\nEnvironment= ROOT_DIR=$ROOT_DIR\n\n[Install]\nWantedBy=multi-user.target" \
    | sudo tee /etc/systemd/system/frontend.service > /dev/null
    printf " -> [${GREEN}OK${NC}]\n"
}

enable_all_daemons() {
    echo -e "\n${GREEN}Abilito tutti i servizi...${NC}"
    sudo systemctl enable backend.service
    sudo systemctl enable mqtt-storage.service
    sudo systemctl enable frontend.service
}

start_all_daemons() {
    echo -e "\n${GREEN}Avvio tutti i servizi...${NC}"
    sudo systemctl start backend.service
    sudo systemctl start mqtt-storage.service
    sudo systemctl start frontend.service
}

stop_all_daemons() {
    echo -e "\n${GREEN}Fermo tutti i servizi...${NC}"
    sudo systemctl stop backend.service
    sudo systemctl stop mqtt-storage.service
    sudo systemctl stop frontend.service
}

restart_all_daemons() {
    echo -e "\n${GREEN}Riavvio tutti i servizi...${NC}"
    sudo systemctl restart backend.service
    sudo systemctl restart mqtt-storage.service
    sudo systemctl restart frontend.service
}

disable_all_daemons() {
    echo -e "\n${GREEN}Disabilito tutti i servizi...${NC}"
    sudo systemctl disable backend.service
    sudo systemctl disable mqtt-storage.service
    sudo systemctl disable frontend.service
}

delete_daemons() {
    sudo rm /etc/systemd/system/backend.service
    sudo rm /etc/systemd/system/mqtt-storage.service
    sudo rm /etc/systemd/system/frontend.service
}

remove() {
    echo -e "${RED}ATTENZIONE${NC}: in questo modo si procederà alla rimozione di Energy-Service.
            La root del progetto non verrà eliminata.\n"
    read -p "Vuoi continuare? [S/n]: " -n 1 -r
    echo -e "\n"
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        stop_all_daemons
        disable_all_daemons
        delete_daemons
        echo -e "\nRimozione completata!"
        echo -e "Ora è possibile rimuovere manualmente i pacchetti nodejs git e jq.\n"
    else
        echo -e "Operazione annullata\n"
    fi
}

while getopts ":chrsDSR" OPTION; do
    case $OPTION in
    h)
        show_help
        exit 1
        ;;
    c)
        clone_repo
        exit 1
        ;;
    r)
        restore_file
        exit 1
        ;;
    s)
        start_all_daemons
        exit 1
        ;;
    D)
        stop_all_daemons
        disable_all_daemons
        exit 1
        ;;
    S)
        stop_all_daemons
        exit 1
        ;;
    R)
        remove
        exit 1
        ;;
    *)
        echo "Opzione non corretta"
        exit 1
        ;;
    esac
done

main
