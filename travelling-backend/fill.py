import requests
import random
import pytz
from faker import Faker
from datetime import datetime, timedelta

def generate_random_date():
    start_date = datetime.now()

    # Define a data máxima como 7 dias a partir da data atual
    end_date = start_date + timedelta(days=7)

    # Gera uma data aleatória entre start_date e end_date
    random_date = start_date + timedelta(
        days=random.randint(0, (end_date - start_date).days),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59),
    )

    # Adiciona o fuso horário (no caso, UTC-3:00)
    timezone = pytz.timezone("America/Sao_Paulo")
    random_date = timezone.localize(random_date)

    # Retorna a representação ISO 8601 da data
    iso_date = random_date.isoformat()

    return iso_date


def get_random_categories(categories):
    # Use random.sample para selecionar aleatoriamente itens da lista
    offset = random.randint(1, len(categories))

    # Gera um número aleatório entre 1 e o tamanho da lista
    selecteds = random.sample(categories, offset)

    # Crie uma nova lista contendo os IDs dos itens selecionados
    return [item["id"] for item in selecteds]


def get_random_list_item(list, size):
    # Use random.sample para selecionar aleatoriamente itens da lista
    offset = random.randint(1, size)

    # Gera um número aleatório entre 1 e o tamanho da lista
    selecteds = random.sample(list, offset)

    return selecteds


def get_user_by_email(email, token):
    url = f"http://localhost:3333/user/{email}"

    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url=url, headers=headers)

    if response.status_code == 200:
        print(f"Usuário {email} foi encontrado!")
        return response.json()
    else:
        print(f"Falha ao buscar o usuário: {email}!")


def create_admin():
    admin_data = {
        "name": "admin",
        "phone": "+55067005400000",
        "email": "admin@email.com",
        "password": "2022@Admin",
    }

    url = "http://localhost:3333/user/admin"

    response = requests.post(url=url, json=admin_data)

    if response.status_code == 201:
        print("Usuário administrador cadastrado com sucesso!")
    else:
        print(
            f"Falha ao cadastrar usuário administrador. Código de resposta: {response.status_code}"
        )
        # print(response.text)

    return admin_data


def get_token_by_user(email, password):
    url = "http://localhost:3333/login"

    login_data = {"email": email, "password": password}

    response = requests.post(url=url, json=login_data)

    if response.status_code == 200:
        # A resposta foi bem-sucedida, então tentamos obter o token
        try:
            token = response.json()["access_token"]
            print("Token obtido com sucesso!")
            return token
        except KeyError:
            print("Falha ao obter token. Resposta não contém 'access_token'.")
            return None
    else:
        print(f"Falha ao obter token. Código de resposta: {response.status_code}")
        print(response.text)
        return None


def fill_categories(token):
    categories = [
        "Caminhada",
        "Restaurante",
        "Ar livre",
        "Mergulho",
        "Trilha",
        "Artesanato",
        "Águas",
        "Hotel",
    ]

    headers = {"Authorization": f"Bearer {token}"}

    url = "http://localhost:3333/category"

    for category in categories:
        payload = {"title": category}

        response = requests.post(url=url, json=payload, headers=headers)

        if (
            response.status_code == 201
        ):  # Verifique se a resposta indica sucesso (código 201 - Created)
            print(f"Categoria '{category}' cadastrada com sucesso!")
        else:
            print(
                f"Falha ao cadastrar categoria '{category}'. Código de resposta: {response.status_code}"
            )
            print(response.text)


def get_all_categories():
    url = "http://localhost:3333/category"

    response = requests.get(url=url)

    if response.status_code == 200:
        categories = response.json()
        if len(categories) > 0:
            print("Categorias foram encontradas!")
        else:
            print("Categorias não encontradas!")
        return response.json()
    else:
        print("Falha ao buscar as categorias!")
        return []


def create_users(categories):
    users = [
        {
            "type": "tourist",
            "payload": {
                "name": "Lucas",
                "lastname": "Bezerra",
                "age": 23,
                "phone": "+55067991882244",
                "email": "lucas@email.com",
                "password": "2022@Lucas",
                "favoriteCategories": get_random_categories(categories=categories),
            },
        },
        {
            "type": "agency",
            "payload": {
                "name": "Tree Trip",
                "phone": "+55067991881014",
                "email": "treetrip@email.com",
                "password": "2022@Tree",
            },
        },
        {
            "type": "business",
            "payload": {
                "name": "Hotel Transilvânia",
                "phone": "+550670000990",
                "email": "hotel@email.com",
                "password": "2022@Hotel",
            },
        },
    ]

    registered_users = {}

    for user in users:
        
        url = f"http://localhost:3333/{user['type']}"

        response = requests.post(url=url, json=user["payload"])

        registered_users[user["type"]] = user["payload"]

        if response.status_code == 201:
            print(f"Usuário do tipo {user['type']} criado com sucesso!")

        else:
            print(f"Falha ao criar o usuário do tipo {user['type']}")
        

    return registered_users


def create_attractions(token, agencyId, categories):
    fake = Faker("pt_BR")

    names = [
        "Bioparque do pantanal",
        "Buraco do padre",
        "Lago do amor",
        "Mergulho nas águas",
        "Penhasco Alto",
        "Praia de areia",
        "Trilha reta",
    ]

    images = [
        "bioparque.jpg",
        "buraco.jpg",
        "lago-do-amor.jpg",
        "mergulho.jpg",
        "penhasco.jpg",
        "praia.jpg",
        "trilha.jpg",
    ]

    addresses = [
        f"Brasil, {fake.estado_sigla()}, {fake.city()}, {fake.bairro()}, {fake.street_address()}, {fake.building_number()}"
        for _ in range(len(names))
    ]
    
    whatToTake = [
        "Tênis de corrida",
        "Garrafa de água",
        "Protetor solar",
        "Roupa de natação",
        "Guarda-chuva",
        "Binóculos",
    ]

    attractions = [
        {
            "name": names[i],
            # "banner": images[i],
            "date": generate_random_date(),
            "location": addresses[i],
            "foundInAttraction": fake.text(),
            "notFoundInAttraction": fake.text(),
            "categories": get_random_categories(categories),
            # "generalMedias": get_random_list_item(images, len(images)),
            "pricing": str(random.randint(1000, 20000)),
            "description": fake.text(),
            "whatToTake": get_random_list_item(whatToTake, len(whatToTake)),
        }
        for i in range(len(names))
    ]

    url = f"http://localhost:3333/attraction/{agencyId}"

    headers = {"Authorization": f"Bearer {token}"}

    for attraction in attractions:
        response = requests.post(url, json=attraction, headers=headers)
        if response.status_code == 201:
            print(f"Atração {attraction['name']} criada com sucesso!")
        else:
            print(f"Erro ao criar a atração: {attraction['name']}!")
       
            
def create_establishments(token, businessId, categories):
    fake = Faker("pt_BR")
    
    names = [
        "Artesanatos Swift",
        "Bar Taboa",
        "Hotel Transilvânia",
        "Juanita Restaurante",
        "Artigos de bonito",
        "Pesque e relaxe",
        "Barreto Steak",
    ]

    images = [
        "artesanato.jpg",
        "bar-taboa.jpg",
        "hotel-presidente-4s.jpg",
        "juanita-restaurante.jpg",
        "loja-turismo.jpg",
        "pesca.jpg",
        "restaurante.jpg",
    ]

    addresses = [
        f"Brasil, {fake.estado_sigla()}, {fake.city()}, {fake.bairro()}, {fake.street_address()}, {fake.building_number()}"
        for _ in range(len(names))
    ]

    openDays = [
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
        "Domingo",
    ]

    # Ordenar a lista aleatória de acordo com a ordem original de openDays
    sorted_open_days = sorted(get_random_list_item(openDays, len(openDays)), key=lambda x: openDays.index(x))

    establishments = [
        {
            "name": names[i],
            # "banner": images[i],
            "description": fake.text(),
            "openHours": generate_random_date(),
            "closeHours": generate_random_date(),
            "minPrice": str(random.randint(80, 150)),
            "maxPrice": str(random.randint(160, 350)),
            "location": addresses[i],
            "openDays": sorted_open_days,
            "foundInEstablishment": fake.text(),
            "otherInformation": fake.text(),
            "phone": f"+550670{i}0099{i}",
            "categories": get_random_categories(categories),
            # "generalMedias": get_random_list_item(images, len(images)),
            # "menuOfServicesMedia": get_random_list_item(images, len(images))
        }
        for i in range(len(names))
    ]

    url = f"http://localhost:3333/establishment/{businessId}"

    headers = {"Authorization": f"Bearer {token}"}

    for establishment in establishments:
        response = requests.post(url, json=establishment, headers=headers)
        if response.status_code == 201:
            print(f"Estabelecimento {establishment['name']} criada com sucesso!")
        else:
            print(f"Erro ao criar a estabelecimento: {establishment['name']}!")


# Cria um usuário admin
admin = create_admin()

# Obtem o token do admin
token = get_token_by_user(admin["email"], admin["password"])

# Busca as categorias
categories = get_all_categories()

# Cria as categorias
if len(categories) == 0:
    fill_categories(token)
    categories = get_all_categories()

# Criar usuários
users = create_users(categories=categories)

# Cria atrações com o usuário de agência criada
agency = get_user_by_email(users["agency"]["email"], token=token)
create_attractions(token, agencyId=agency["id"], categories=categories)

# Cria estabelecimentos com o usuário de comércio criado
business = get_user_by_email(users["business"]["email"], token=token)
create_establishments(token, businessId=business["id"], categories=categories)
