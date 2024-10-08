const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");

const app = jsonServer.create();
const router = jsonServer.router("db.json");

const MOCKED_SECRET = "your-secret-key";

// /!\ Bind the router db to the app
app.db = router.db;

// Middleware para parsing de JSON
app.use(jsonServer.bodyParser);

app.post("/auth/login", (req, res) => {
  const body = req.body;

  // Simulate user validation and JWT generation
  const user = app.db
    .get("users")
    .find({ email: body.email, password: body.password })
    .value();

  if (user) {
    const access_token = jwt.sign(
      { email: user.email, sub: user.id },
      MOCKED_SECRET,
      { expiresIn: "1h" }
    );

    // Customize the response here
    res.status(200).json({ access_token });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

app.post("/auth/register", (req, res, next) => {
  const body = req.body;

  const posts = app.db.get("users").value();
  const id = posts.length ? Math.max(...posts.map((post) => post.id)) + 1 : 1;

  // Adicionar o novo post ao banco de dados
  app.db
    .get("users")
    .push({
      ...body,
      id,
      avatar: null,
      createdAt: new Date().toISOString(),
    })
    .write();

  const token = jwt.sign({ email: body.email, sub: id }, MOCKED_SECRET, {
    expiresIn: "1h",
  });

  // Customize the response here
  res.status(201).json({
    access_token: token,
  });
});

app.post("/auth/forgot-password", (req, res, next) => {
  res.status(201).send("A verification code has been sent to mock@teste.com");
});

app.patch("/auth/reset-password", (req, res, next) => {
  res.status(201).json({
    access_token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsIm5hbWUiOiJGZWxpY2lhIFRlc3RlIiwiaWF0IjoxNzIyMDE3NTA3LCJleHAiOjE3MjIxMDM5MDcsImF1ZCI6InVzZXJzIiwiaXNzIjoiZG5jX2hvdGVsIn0.WQw1JuFsnBLrgX6q1Dg-vxCux_gVSB5-gdv3SBpg2v0",
  });
});

app.post("/users/avatar", (req, res) => {
  res.status(201).json({
    id: 2,
    email: "felicia@teste.com",
    name: "Felicia Teste",
    role: "USER",
    avatar: "arquivo-mockado.jpg",
    createdAt: "2024-07-26T08:13:19.954Z",
  });
});

app.get("/hotels", (req, res) => {
  // Pega os parâmetros de paginação da requisição
  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.limit) || 10;

  // Obtém todos os hotéis
  const hotels = app.db.get("hotels").value();

  // Calcula o total de hotéis
  const total = hotels.length;

  // Calcula o índice de início e fim da página
  const start = (page - 1) * perPage;
  const end = start + perPage;

  // Seleciona os hotéis para a página atual
  const paginatedHotels = hotels.slice(start, end);

  // Envia a resposta com a paginação
  res.status(200).jsonp({
    total: total,
    page: page,
    per_page: perPage,
    data: paginatedHotels,
  });
});

app.get("/hotels/owner", (req, res) => {
  const hotels = app.db.get("hotels").value();

  res.status(200).jsonp(hotels);
});

app.post("/reservations", (req, res) => {
  res.status(201).jsonp({
    id: 1,
    userId: 2,
    hotelId: 2,
    checkIn: "2024-07-30T03:00:00.000Z",
    checkOut: "2024-08-05T03:00:00.000Z",
    total: -5760,
    status: "PENDING",
    createdAt: "2024-07-27T07:22:32.404Z",
    updatedAt: "2024-07-27T07:22:32.404Z",
  });
});

app.post("/hotels", (req, res) => {
  res.status(201).jsonp({
    id: 1,
    name: "Hotel Dnc Eletro",
    description: "Hotel bonito",
    address: "Rua Dnc, 123",
    image: "/hotel1.jpg",
    price: 300,
    ownerId: 1,
    createdAt: "2024-07-26T21:17:35.575Z",
    updatedAt: "2024-07-26T21:17:35.575Z",
    owner: {
      id: 1,
      email: "rafa@mock.com",
      password: "12345",
      name: "Rafael Mock",
      role: "ADMIN",
      avatar: null,
      createdAt: "2024-07-25T00:46:18.442Z",
    },
  });
});

app.get("/reservations/user", (req, res) => {
  const reservations = app.db.get("reservations").value();
  res.status(200).jsonp(reservations);
});

app.get("/reservations/hotel/:id", (req, res) => {
  const reservations = app.db.get("reservations").value();
  res.status(200).jsonp(reservations);
});

// You must apply the auth middleware before the router
app.use(router);
app.listen(3000);
