import React, { useState } from 'react';
import './Form.css';

const Form = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    cpf: '',
    telefoneFixo: '',
    celular: '',
    nomePai: '',
    nomeMae: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const [errors, setErrors] = useState({});
  const [idade, setIdade] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'dataNascimento') {
      calcularIdade(value);
    }
  };

  const calcularIdade = (dataNascimento) => {
    const [ano, mes, dia] = dataNascimento.split('-');
    const nascimento = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    let idadeCalculada = hoje.getFullYear() - nascimento.getFullYear();
    if (
      hoje.getMonth() < nascimento.getMonth() ||
      (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())
    ) {
      idadeCalculada--;
    }
    setIdade(idadeCalculada);
  };

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
  };

  const validateField = (fieldName, value) => {
    let errorMsg = '';
    switch (fieldName) {
      case 'nomeCompleto':
        if (!value || value.split(' ').length < 2) errorMsg = 'Nome completo deve conter pelo menos dois nomes.';
        break;
      case 'cpf':
        if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value) && !/^\d{11}$/.test(value)) {
          errorMsg = 'CPF inválido. Use o formato XXX.XXX.XXX-XX ou 11 dígitos numéricos.';
        } else if (!validarCPF(value)) {
          errorMsg = 'CPF inválido. Verificação de dígitos falhou.';
        }
        break;
      case 'nomePai':
      case 'nomeMae':
        if (idade < 18 && !value) {
          errorMsg = `${fieldName === 'nomePai' ? 'Nome do Pai' : 'Nome da Mãe'} é obrigatório para menores de 18 anos.`;
        }
        break;
      case 'senha':
        if (value.length < 8) errorMsg = 'A senha deve ter pelo menos 8 caracteres.';
        break;
      case 'confirmarSenha':
        if (value !== formData.senha) errorMsg = 'As senhas não coincidem.';
        break;
      default:
        break;
    }
    setErrors({ ...errors, [fieldName]: errorMsg });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Object.keys(formData).forEach((field) => validateField(field, formData[field]));
    if (Object.values(errors).every((error) => error === '')) {
      console.log('Dados enviados:', formData);
    } else {
      console.log('Erros no formulário:', errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Formulário de Registro</h2>

      <section>
        <h3>Informações Pessoais</h3>
        <input name="nomeCompleto" placeholder="Nome Completo" onChange={handleChange} onBlur={handleBlur} />
        {errors.nomeCompleto && <span className="error">{errors.nomeCompleto}</span>}

        <input name="dataNascimento" type="date" onChange={handleChange} onBlur={handleBlur} />
        <span>Idade: {idade !== null ? idade : 'N/A'}</span>

        <input name="cpf" placeholder="CPF (XXX.XXX.XXX-XX ou 11 dígitos)" onChange={handleChange} onBlur={handleBlur} />
        {errors.cpf && <span className="error">{errors.cpf}</span>}
      </section>

      {idade < 18 && (
        <section>
          <h3>Informações Complementares (para menores de 18 anos)</h3>
          <input name="nomePai" placeholder="Nome do Pai" onChange={handleChange} onBlur={handleBlur} />
          {errors.nomePai && <span className="error">{errors.nomePai}</span>}

          <input name="nomeMae" placeholder="Nome da Mãe" onChange={handleChange} onBlur={handleBlur} />
          {errors.nomeMae && <span className="error">{errors.nomeMae}</span>}
        </section>
      )}

      <button type="submit">Enviar</button>
    </form>
  );
};

export default Form;
