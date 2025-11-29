import React, { useState, useEffect } from "react";

// Single-file React component: "CourseStore"
// - Uses Tailwind classes for styling (no imports required in this file)
// - Default export a React component that renders a small course store
// - Features: course catalog, filters, course page modal, cart saved to localStorage, checkout form (mock)
// - Designed to be copy-pasted into a create-react-app / Vite project

export default function CourseStore() {
  // Sample course data (in a real app, this would come from an API)
  const sampleCourses = [
    {
      id: "c1",
      title: "Lógica de Programação - Do Zero ao Avançado",
      short: "Aprenda pensamento lógico, algoritmos e estruturas de controle.",
      price: 49.0,
      level: "Iniciante",
      lessons: 28,
      duration: "12h",
      tags: ["lógica", "algoritmo", "iniciante"],
    },
    {
      id: "c2",
      title: "Python para Lógica e Automação",
      short: "Use Python para traduzir algoritmos em código e automatizar tarefas.",
      price: 69.0,
      level: "Intermediário",
      lessons: 35,
      duration: "18h",
      tags: ["python", "automação"],
    },
    {
      id: "c3",
      title: "Estruturas de Dados e Algoritmos",
      short: "Listas, pilhas, filas, árvores e como pensar em eficiência.",
      price: 79.0,
      level: "Avançado",
      lessons: 40,
      duration: "22h",
      tags: ["algoritmos", "estruturas"],
    },
    {
      id: "c4",
      title: "JavaScript: Lógica aplicada ao Frontend",
      short: "Aprenda a aplicar lógica em problemas reais do frontend com JS.",
      price: 59.0,
      level: "Intermediário",
      lessons: 30,
      duration: "15h",
      tags: ["javascript", "frontend"],
    },
  ];

  const [courses] = useState(sampleCourses);
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("Todos");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart_courses");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart_courses", JSON.stringify(cart));
  }, [cart]);

  // Derived filtered courses
  const filtered = courses.filter((c) => {
    const matchQuery =
      query.trim() === "" ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.short.toLowerCase().includes(query.toLowerCase()) ||
      c.tags.join(" ").toLowerCase().includes(query.toLowerCase());
    const matchLevel = levelFilter === "Todos" || c.level === levelFilter;
    return matchQuery && matchLevel;
  });

  function addToCart(course) {
    setCart((cur) => {
      if (cur.find((x) => x.id === course.id)) return cur; // avoid duplicate
      return [...cur, course];
    });
  }

  function removeFromCart(id) {
    setCart((cur) => cur.filter((c) => c.id !== id));
  }

  function totalPrice() {
    return cart.reduce((s, c) => s + c.price, 0).toFixed(2);
  }

  function handleCheckoutSubmit(form) {
    // This is a mock checkout: in a real app you'd call a payments API.
    // We'll simulate success and clear the cart.
    const order = {
      id: `ORD-${Date.now()}`,
      name: form.name,
      email: form.email,
      items: cart,
      total: totalPrice(),
      date: new Date().toISOString(),
    };

    // fake delay to mimic server
    setOrderStatus("processando");
    setTimeout(() => {
      setOrderStatus({ success: true, order });
      setCart([]);
      setShowCheckout(false);
      localStorage.removeItem("cart_courses");
    }, 900);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded font-bold">LP</div>
            <div>
              <h1 className="font-bold text-lg">Cursos de Lógica & Programação</h1>
              <p className="text-sm text-slate-500">Aprenda do zero até projetos reais</p>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar cursos..."
                className="border rounded px-3 py-2 text-sm w-64"
              />

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option>Todos</option>
                <option>Iniciante</option>
                <option>Intermediário</option>
                <option>Avançado</option>
              </select>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="relative bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded"
            >
              Carrinho
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cart.length}</span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Filters & About */}
        <aside className="lg:col-span-1 bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Sobre o curso</h2>
          <p className="text-sm text-slate-600 mt-2">Venda de cursos focados em lógica e programação. Cada curso tem vídeos, exercícios e projetos práticos.</p>

          <div className="mt-4">
            <h3 className="text-sm font-medium">Níveis</h3>
            <div className="mt-2 flex flex-col gap-2">
              {["Todos", "Iniciante", "Intermediário", "Avançado"].map((lev) => (
                <button
                  key={lev}
                  onClick={() => setLevelFilter(lev)}
                  className={`text-left px-3 py-2 rounded ${levelFilter === lev ? "bg-indigo-100" : "hover:bg-slate-50"}`}
                >
                  {lev}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium">Destaques</h3>
            <ul className="text-sm text-slate-700 mt-2 space-y-2">
              <li>✅ Aulas gravadas</li>
              <li>✅ Material para download</li>
              <li>✅ Exercícios práticos</li>
              <li>✅ Certificado digital</li>
            </ul>
          </div>
        </aside>

        {/* Right: Course list and Cart Summary (spans 3 cols) */}
        <section className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((course) => (
              <article key={course.id} className="bg-white p-4 rounded shadow flex flex-col">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded text-white flex items-center justify-center font-bold">
                    {course.title.split(" ").slice(0,2).map((s)=>s[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-slate-600">{course.short}</p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <span className="px-2 py-1 border rounded">{course.level}</span>
                      <span className="px-2 py-1 border rounded">{course.lessons} aulas</span>
                      <span className="px-2 py-1 border rounded">{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-lg font-bold">R$ {course.price.toFixed(2)}</div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="text-sm px-3 py-1 border rounded"
                      >Ver</button>
                      <button
                        onClick={() => addToCart(course)}
                        className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                      >Adicionar</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full bg-white p-6 rounded shadow text-center">
                <p className="text-slate-600">Nenhum curso encontrado. Tente outra palavra-chave.</p>
              </div>
            )}
          </div>

          {/* Cart summary */}
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Resumo do Carrinho</h3>
            {cart.length === 0 ? (
              <p className="text-sm text-slate-600 mt-2">Seu carrinho está vazio.</p>
            ) : (
              <div className="mt-2">
                <ul className="space-y-2">
                  {cart.map((c) => (
                    <li key={c.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{c.title}</div>
                        <div className="text-sm text-slate-500">R$ {c.price.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(c.id)} className="text-sm text-red-600">Remover</button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between">
                  <div className="font-semibold">Total</div>
                  <div className="font-bold text-lg">R$ {totalPrice()}</div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => setShowCheckout(true)} className="px-4 py-2 bg-emerald-500 text-white rounded">Finalizar compra</button>
                  <button onClick={() => { setCart([]); localStorage.removeItem('cart_courses') }} className="px-4 py-2 border rounded">Limpar</button>
                </div>
              </div>
            )}
          </div>

          {/* Footer / Info */}
          <div className="mt-6 text-sm text-slate-500">
            <p>Pagamento simulado — este exemplo não processa pagamentos reais. Para integrar pagamentos use Stripe, PayPal, ou APIs locais.</p>
          </div>
        </section>
      </main>

      {/* Course Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded max-w-2xl w-full p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
                <p className="text-sm text-slate-600 mt-1">{selectedCourse.short}</p>
                <div className="mt-3 flex gap-2 text-xs text-slate-500">
                  <span className="px-2 py-1 border rounded">{selectedCourse.level}</span>
                  <span className="px-2 py-1 border rounded">{selectedCourse.lessons} aulas</span>
                  <span className="px-2 py-1 border rounded">{selectedCourse.duration}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="font-bold text-lg">R$ {selectedCourse.price.toFixed(2)}</div>
                <div className="flex gap-2">
                  <button onClick={() => addToCart(selectedCourse)} className="px-3 py-1 bg-indigo-600 text-white rounded">Adicionar</button>
                  <button onClick={() => setSelectedCourse(null)} className="px-3 py-1 border rounded">Fechar</button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium">O que você vai aprender</h4>
              <ul className="list-disc pl-5 mt-2 text-sm text-slate-700">
                <li>Fundamentos de lógica e formação de algoritmos</li>
                <li>Variáveis, tipos e operadores</li>
                <li>Estruturas de controle (if, loops)</li>
                <li>Funções e abstração</li>
                <li>Projeto prático final</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onSubmit={handleCheckoutSubmit}
        />
      )}

      {/* Order status toast */}
      {orderStatus && (
        <div className="fixed right-4 bottom-4 bg-white p-4 rounded shadow z-50">
          {orderStatus === "processando" ? (
            <div>Processando pedido...</div>
          ) : orderStatus.success ? (
            <div>
              <div className="font-semibold">Pedido realizado!</div>
              <div className="text-sm text-slate-600">ID: {orderStatus.order.id}</div>
            </div>
          ) : (
            <div>Erro no pedido</div>
          )}
        </div>
      )}
    </div>
  );
}

function CheckoutModal({ cart, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState(null);

  function submit(e) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError("Preencha nome e e-mail");
      return;
    }
    if (cart.length === 0) {
      setError("O carrinho está vazio");
      return;
    }

    // very basic email check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("E-mail inválido");
      return;
    }

    onSubmit({ name, email, agree });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded max-w-xl w-full p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Finalizar compra</h3>
          <button onClick={onClose} className="text-slate-600">Fechar</button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium">E-mail</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <div className="text-sm text-slate-600">Aceito receber materiais e atualizações</div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex items-center justify-between">
            <div className="text-sm">Total: <strong>R$ {cart.reduce((s,c)=>s+c.price,0).toFixed(2)}</strong></div>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded">Pagar (simulado)</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
