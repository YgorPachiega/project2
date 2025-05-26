const API_BASE = "https://app-qreader.onrender.com/api";
const prestadorId = sessionStorage.getItem('prestadorId');
let eventos = [];
let participantes = [];

window.onload = () => {
  carregarEventos();
};

async function carregarEventos() {
  const res = await fetch(`${API_BASE}/eventos/by-prestador/${prestadorId}`);
  eventos = await res.json();
  const select = document.getElementById('eventoSelect');
  select.innerHTML = '<option value="">Selecione...</option>' + 
    eventos.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');
}

async function carregarParticipantes() {
  const eventoId = document.getElementById('eventoSelect').value;
  if (!eventoId) {
    document.getElementById('listaParticipantes').innerHTML = 'Selecione um evento para visualizar.';
    return;
  }

  const res = await fetch(`${API_BASE}/participantes/by-evento/${eventoId}`);
  participantes = await res.json();
  renderizarParticipantes();
}

function renderizarParticipantes() {
  if (!participantes.length) {
    document.getElementById('listaParticipantes').innerHTML = '<p>Nenhum participante cadastrado.</p>';
    return;
  }

  let html = `<table class="table table-dark table-bordered">
    <thead>
      <tr>
        <th>Nome</th>
        <th>CPF</th>
        <th>Empresa</th>
        <th>Ações</th>
      </tr>
    </thead><tbody>`;

  participantes.forEach(p => {
    html += `<tr>
      <td>${p.nome}</td>
      <td>${p.cpf}</td>
      <td>${p.empresa}</td>
      <td>
        <button class="btn btn-sm btn-success" onclick="registrarCheckin('${p.id}')">Check-in</button>
        <button class="btn btn-sm btn-warning" onclick="registrarCheckout('${p.id}')">Check-out</button>
      </td>
    </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('listaParticipantes').innerHTML = html;
}

function abrirModalCadastrar() {
  document.getElementById('participanteId').value = '';
  document.getElementById('nome').value = '';
  document.getElementById('cpf').value = '';
  document.getElementById('empresa').value = '';
  const modal = new bootstrap.Modal(document.getElementById('modalParticipante'));
  modal.show();
}

async function salvarParticipante(event) {
  event.preventDefault();
  const eventoId = document.getElementById('eventoSelect').value;
  const body = {
    nome: document.getElementById('nome').value,
    cpf: document.getElementById('cpf').value,
    empresa: document.getElementById('empresa').value,
    eventoId,
    solicitanteId: prestadorId
  };

  const res = await fetch(`${API_BASE}/participantes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    alert('Participante cadastrado com sucesso!');
    carregarParticipantes();
    bootstrap.Modal.getInstance(document.getElementById('modalParticipante')).hide();
  } else {
    alert('Erro ao cadastrar participante.');
  }
}

async function registrarCheckin(participanteId) {
  const eventoId = document.getElementById('eventoSelect').value;
  const res = await fetch(`${API_BASE}/checkin/entrada`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participanteId, eventoId })
  });

  if (res.ok) {
    alert('Check-in realizado com sucesso!');
  } else {
    alert('Erro ao realizar check-in.');
  }
}

async function registrarCheckout(participanteId) {
  const eventoId = document.getElementById('eventoSelect').value;
  const res = await fetch(`${API_BASE}/checkin/saida`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participanteId, eventoId })
  });

  if (res.ok) {
    alert('Check-out realizado com sucesso!');
  } else {
    alert('Erro ao realizar check-out.');
  }
}