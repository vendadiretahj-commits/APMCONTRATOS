const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const defaults=[
 {codigo:'NEG-0012',imovel:'Vila das Flores — Apto 501',comprador:'Elaine Souza',vendedor:'Nivia Teofilo',valor:290000,status:'Em elaboração',data:'15/09/2026'},
 {codigo:'NEG-0011',imovel:'Condomínio Dallas — Casa 05',comprador:'Jafeson e Giselle',vendedor:'Wellington e Nycolle',valor:780000,status:'Dados confirmados',data:'14/09/2026'},
 {codigo:'NEG-0010',imovel:'Life Flores — Apto 608 C',comprador:'Francisca Sales',vendedor:'Vicente e Fabiana',valor:362000,status:'Contrato gerado',data:'12/09/2026'},
 {codigo:'NEG-0009',imovel:'Residencial Amazonas — Casa 10',comprador:'Juliana Costa',vendedor:'Roberto Dias',valor:680000,status:'Aguardando documentos',data:'10/09/2026'},
 {codigo:'NEG-0008',imovel:'Parque das Laranjeiras — Apto 202',comprador:'Marcos Vieira',vendedor:'Patrícia Gomes',valor:520000,status:'Concluída',data:'08/09/2026'}
];
let deals=JSON.parse(localStorage.getItem('apm_deals')||'null')||defaults;
let step=0;
let draft=JSON.parse(localStorage.getItem('apm_draft')||'null')||{
 vendedor:{nome:'',cpf:'',estadoCivil:'',profissao:'',documento:'CNH',numeroDoc:'',endereco:'',nacionalidade:'',nascimento:'',conjuge:'',regimeBens:''},
 comprador:{nome:'',cpf:'',estadoCivil:'',profissao:'',documento:'CNH',numeroDoc:'',endereco:'',nacionalidade:'',nascimento:'',conjuge:'',regimeBens:''},
 imovel:{tipo:'Apartamento',condominio:'',logradouro:'',numero:'',complemento:'',bairro:'',cidade:'Manaus',uf:'AM',cep:'',matricula:'',cnm:'',cartorio:'',inscricao:'',titularSugerido:'',atosRegistrarios:'',descricaoRegistral:'',areaPrivativaRegistro:'',areaTotalRegistro:'',areaConstruidaRegistro:'',areaEscolhida:''},
 valor:0,pagamentos:[],posse:{tipo:'Após quitação',data:'',texto:''},despesas:{itbi:'Comprador',registro:'Comprador',escritura:'Comprador',anteriores:'Vendedor'},
 clausulas:{bens:false,bensTexto:'',quitacao:false,jaPosse:false,procuracao:false,corretagem:false}
};
function money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
function enterApp(){ $('#login').classList.add('hidden'); $('#app').classList.remove('hidden'); renderAll(); }
function goPage(name){ $$('.nav').forEach(b=>b.classList.toggle('active',b.dataset.page===name)); $$('.page').forEach(p=>p.classList.remove('active-page')); $('#page-'+name).classList.add('active-page'); if(name==='nova')renderWizard(); }
$$('.nav').forEach(b=>b.onclick=()=>goPage(b.dataset.page));
function statusClass(s){ if(/conclu|confirm/i.test(s))return'b-green'; if(/aguard/i.test(s))return'b-orange'; if(/gerado|assinado/i.test(s))return'b-purple'; return'b-blue' }
function renderTables(){ const rows=deals.map(d=>`<tr><td><b>${d.codigo}</b></td><td>${d.imovel}</td><td>${d.comprador}</td><td>${d.vendedor||''}</td><td>${money(d.valor)}</td><td><span class="badge ${statusClass(d.status)}">${d.status}</span></td><td>${d.data||''}</td></tr>`).join(''); $('#recentTable tbody').innerHTML=rows.replaceAll(/<td>[^<]*<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><td>/g,m=>m); $('#allTable tbody').innerHTML=deals.map(d=>`<tr><td><b>${d.codigo}</b></td><td>${d.imovel}</td><td>${d.comprador}</td><td>${d.vendedor}</td><td>${money(d.valor)}</td><td><span class="badge ${statusClass(d.status)}">${d.status}</span></td></tr>`).join('');
 const rt=$('#recentTable tbody'); rt.innerHTML=deals.map(d=>`<tr><td><b>${d.codigo}</b></td><td>${d.imovel}</td><td>${d.comprador}</td><td>${money(d.valor)}</td><td><span class="badge ${statusClass(d.status)}">${d.status}</span></td><td>${d.data}</td></tr>`).join(''); }
function filterTable(){ const q=$('#globalSearch').value.toLowerCase(); $$('#recentTable tbody tr,#allTable tbody tr').forEach(r=>r.style.display=r.innerText.toLowerCase().includes(q)?'':'none'); }
function renderChart(){ const vals=[4,6,5,8,7,10], labels=['Abr','Mai','Jun','Jul','Ago','Set']; const w=620,h=190,p=22,max=Math.max(...vals)+2; const pts=vals.map((v,i)=>[p+i*(w-2*p)/(vals.length-1),h-p-v*(h-2*p)/max]); const grid=[0,1,2,3,4].map(i=>`<line x1="${p}" x2="${w-p}" y1="${p+i*(h-2*p)/4}" y2="${p+i*(h-2*p)/4}" stroke="#e7edf5"/>`).join(''); const poly=pts.map(p=>p.join(',')).join(' '); const dots=pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#0877f9"/><text x="${p[0]}" y="${h}" text-anchor="middle" class="axis-label">${labels[i]}</text>`).join(''); $('#lineChart').innerHTML=`<svg viewBox="0 0 ${w} ${h}">${grid}<polyline fill="none" stroke="#0877f9" stroke-width="4" points="${poly}"/>${dots}</svg>`; }
function renderAll(){renderTables();renderChart();renderWizard();}
const stepNames=['Documentos','Partes','Imóvel','Financeiro','Posse e cláusulas','Revisão'];
function renderSteps(){ $('#steps').innerHTML=stepNames.map((n,i)=>`<div class="step ${i===step?'on':''}">${i+1}. ${n}</div>`).join(''); }
function navBtns(){return `<div class="wizard-actions"><button class="ghost" onclick="prevStep()" ${step===0?'disabled':''}>← Voltar</button><button class="primary" onclick="nextStep()">${step===5?'Salvar negociação':'Continuar →'}</button></div>`}
function renderWizard(){renderSteps(); const w=$('#wizard'); if(!w)return; if(step===0)w.innerHTML=docsStep()+navBtns(); if(step===1)w.innerHTML=partesStep()+navBtns(); if(step===2)w.innerHTML=imovelStep()+navBtns(); if(step===3)w.innerHTML=financeiroStep()+navBtns(); if(step===4)w.innerHTML=posseStep()+navBtns(); if(step===5)w.innerHTML=revisaoStep()+`<div class="wizard-actions"><button class="ghost" onclick="prevStep()">← Voltar</button><div><button class="ghost no-print" onclick="downloadDocx()">Gerar DOCX</button> <button class="ghost no-print" onclick="downloadPdf()">Gerar PDF</button> <button class="primary no-print" onclick="finishDeal()">Salvar negociação</button></div></div>`; bindInputs(); }
function docsStep(){return `<h2>1. Documentos da negociação</h2><p>Envie os documentos e deixe o APM preencher vendedor, comprador e imóvel. Você revisa os dados antes de continuar.</p><div class="upload-grid">${['Vendedor — documentos pessoais','Comprador — documentos pessoais','Matrícula / Registro','BCI / IPTU'].map((x,i)=>`<div class="upload"><b>${x}</b><p>Arraste ou selecione</p><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onchange="processWizardDocs(this,${i})"><small id="files${i}">Nenhum arquivo</small><div id="docstatus${i}" class="doc-mini-status"></div></div>`).join('')}</div><div class="summary-block" style="margin-top:16px"><b>Fluxo automático:</b> os campos encontrados são aplicados ao rascunho conforme o papel do documento. Você poderá corrigir tudo na etapa seguinte. <br><b>Metragens:</b> Matrícula e BCI ficam separadas e não geram alerta de divergência.</div><div id="wizardDocResults" class="wizard-doc-results"></div>`}
function showFiles(inp,i){$('#files'+i).textContent=[...inp.files].map(f=>f.name).join(', ')}
async function processWizardDocs(inp,i){
  showFiles(inp,i); const files=[...inp.files]; if(!files.length)return;
  const roles=['Vendedor','Comprador','Imóvel','Imóvel']; const declared=['auto','auto','Matrícula','BCI/IPTU'];
  const st=$('#docstatus'+i); st.textContent='Processando 0/'+files.length+'...'; let ok=0; let notes=[];
  for(const f of files){
    try{
      const fd=new FormData(); fd.append('file',f); fd.append('declared_type',declared[i]); fd.append('role',roles[i]);
      const r=await fetch('/api/extract',{method:'POST',body:fd}); if(!r.ok)throw new Error('Falha na leitura');
      const out=await r.json(); applyExtractionToDraft(out,roles[i],false); ok++; notes.push(`${f.name}: ${out.document_type}`); st.textContent=`Processando ${ok}/${files.length}...`;
    }catch(e){notes.push(`${f.name}: não processado`)}
  }
  persistDraft(); st.textContent=ok===files.length?`✓ ${ok} arquivo(s) lido(s)`:`⚠ ${ok}/${files.length} lidos`;
  const box=$('#wizardDocResults'); if(box)box.innerHTML=`<div class="ok-item"><b>Dados aplicados ao rascunho.</b><br>${notes.join('<br>')}</div>`;
}

function field(path,label,val,type='text',opts=''){ if(type==='select')return `<div class="field"><label>${label}</label><select data-path="${path}">${opts}</select></div>`; return `<div class="field"><label>${label}</label><input type="${type}" data-path="${path}" value="${val??''}"></div>` }
function partesStep(){const v=draft.vendedor,c=draft.comprador;return `<h2>2. Conferência das partes</h2><p>Os campos preenchidos automaticamente continuam editáveis.</p><h3>Vendedor</h3><div class="form-grid three">${field('vendedor.nome','Nome',v.nome)}${field('vendedor.cpf','CPF',v.cpf)}${field('vendedor.estadoCivil','Estado civil',v.estadoCivil)}${field('vendedor.profissao','Profissão',v.profissao)}${field('vendedor.numeroDoc','RG/CNH',v.numeroDoc)}${field('vendedor.nacionalidade','Nacionalidade',v.nacionalidade)}${field('vendedor.nascimento','Nascimento',v.nascimento)}${field('vendedor.conjuge','Cônjuge',v.conjuge)}${field('vendedor.regimeBens','Regime de bens',v.regimeBens)}${field('vendedor.endereco','Endereço',v.endereco)}</div><h3>Comprador</h3><div class="form-grid three">${field('comprador.nome','Nome',c.nome)}${field('comprador.cpf','CPF',c.cpf)}${field('comprador.estadoCivil','Estado civil',c.estadoCivil)}${field('comprador.profissao','Profissão',c.profissao)}${field('comprador.numeroDoc','RG/CNH',c.numeroDoc)}${field('comprador.nacionalidade','Nacionalidade',c.nacionalidade)}${field('comprador.nascimento','Nascimento',c.nascimento)}${field('comprador.conjuge','Cônjuge',c.conjuge)}${field('comprador.regimeBens','Regime de bens',c.regimeBens)}${field('comprador.endereco','Endereço',c.endereco)}</div>`}
function imovelStep(){const x=draft.imovel;return `<h2>3. Imóvel</h2><div class="form-grid three">${field('imovel.tipo','Tipo',x.tipo)}${field('imovel.condominio','Condomínio',x.condominio)}${field('imovel.matricula','Matrícula',x.matricula)}${field('imovel.logradouro','Logradouro',x.logradouro)}${field('imovel.numero','Número',x.numero)}${field('imovel.complemento','Apto/Bloco/Torre',x.complemento)}${field('imovel.bairro','Bairro',x.bairro)}${field('imovel.cidade','Cidade',x.cidade)}${field('imovel.uf','UF',x.uf)}${field('imovel.cep','CEP',x.cep)}${field('imovel.cartorio','Cartório',x.cartorio)}${field('imovel.cnm','CNM',x.cnm||'')}${field('imovel.inscricao','Inscrição imobiliária',x.inscricao)}${field('imovel.titularSugerido','Titular mais recente aparente',x.titularSugerido||'')}${field('imovel.atosRegistrarios','Atos registrais identificados',x.atosRegistrarios||'')}${field('imovel.areaPrivativaRegistro','Área privativa do registro',x.areaPrivativaRegistro||'')}${field('imovel.areaTotalRegistro','Área total do registro',x.areaTotalRegistro||'')}${field('imovel.areaConstruidaRegistro','Área construída mais recente',x.areaConstruidaRegistro||'')}${field('imovel.areaEscolhida','Metragem a inserir (opcional)',x.areaEscolhida)}</div><div class="summary-block"><b>Metragem:</b> vazia por padrão. Mesmo que Matrícula e BCI tenham áreas diferentes, o sistema não alertará divergência.</div>`}
function financeiroStep(){ const total=draft.pagamentos.reduce((s,p)=>s+Number(p.valor||0),0), dif=Number(draft.valor||0)-total; return `<h2>4. Valor e pagamentos</h2><div class="field" style="max-width:320px"><label>Valor total da venda</label><input type="number" data-path="valor" value="${draft.valor||''}" oninput="syncAndRenderFinance()"></div><h3>Pagamentos</h3><div id="payments">${draft.pagamentos.map((p,i)=>payRow(p,i)).join('')}</div><button class="ghost" onclick="addPayment()">+ Adicionar pagamento</button><div class="total-box ${dif===0&&draft.valor?'ok':'warn'}"><span>Pagamentos: <b>${money(total)}</b></span><span>Diferença: <b>${money(dif)}</b></span></div>`}
function payRow(p,i){return `<div class="pay-row"><select onchange="setPay(${i},'tipo',this.value)">${['Sinal','Entrada','Parcela','Financiamento','Quitação de saldo devedor','Pagamento a terceiro'].map(o=>`<option ${p.tipo===o?'selected':''}>${o}</option>`).join('')}</select><input type="number" value="${p.valor||''}" placeholder="Valor" oninput="setPay(${i},'valor',this.value,true)"><select onchange="setPay(${i},'forma',this.value)">${['PIX','Transferência','Boleto','Financiamento bancário','Outro'].map(o=>`<option ${p.forma===o?'selected':''}>${o}</option>`).join('')}</select><input value="${p.condicao||''}" placeholder="Na assinatura / data / condição" oninput="setPay(${i},'condicao',this.value)"><button class="remove" onclick="removePay(${i})">×</button></div>`}
function posseStep(){const p=draft.posse,c=draft.clausulas; return `<h2>5. Posse, despesas e cláusulas especiais</h2><div class="form-grid"><div class="field"><label>Posse/entrega</label><select data-path="posse.tipo">${['Na assinatura','Após sinal','Após entrada','Após quitação','Após financiamento','Data específica','Já está na posse','Personalizado'].map(o=>`<option ${p.tipo===o?'selected':''}>${o}</option>`).join('')}</select></div>${field('posse.data','Data limite (se houver)',p.data,'date')}<div class="field"><label>ITBI</label><select data-path="despesas.itbi"><option ${draft.despesas.itbi==='Comprador'?'selected':''}>Comprador</option><option ${draft.despesas.itbi==='Vendedor'?'selected':''}>Vendedor</option></select></div><div class="field"><label>Registro</label><select data-path="despesas.registro"><option ${draft.despesas.registro==='Comprador'?'selected':''}>Comprador</option><option ${draft.despesas.registro==='Vendedor'?'selected':''}>Vendedor</option></select></div></div><h3>Cláusulas</h3><div class="clause-list"><label><input type="checkbox" data-check="bens" ${c.bens?'checked':''}> Bens permanecerão no imóvel</label>${c.bens?`<div class="field"><textarea data-path="clausulas.bensTexto" placeholder="Ex.: ares-condicionados dos quartos; armários da cozinha; racks...">${c.bensTexto}</textarea></div>`:''}<label><input type="checkbox" data-check="quitacao" ${c.quitacao?'checked':''}> Quitação de financiamento do vendedor</label><label><input type="checkbox" data-check="jaPosse" ${c.jaPosse?'checked':''}> Comprador já está na posse</label><label><input type="checkbox" data-check="procuracao" ${c.procuracao?'checked':''}> Procuração / representação</label><label><input type="checkbox" data-check="corretagem" ${c.corretagem?'checked':''}> Corretagem</label></div>`}
function revisaoStep(){return `<h2>6. Revisão e geração</h2><div class="review"><div>${summary()}</div><div><div class="contract-preview" id="contractText">${buildContract()}</div></div></div>`}
function summary(){return `<div class="summary-block"><b>Vendedor</b><br>${draft.vendedor.nome||'Não informado'}<br>${draft.vendedor.cpf||''}</div><div class="summary-block"><b>Comprador</b><br>${draft.comprador.nome||'Não informado'}<br>${draft.comprador.cpf||''}</div><div class="summary-block"><b>Imóvel</b><br>${draft.imovel.condominio||draft.imovel.tipo} ${draft.imovel.complemento||''}<br>Matrícula: ${draft.imovel.matricula||'—'}</div><div class="summary-block"><b>Financeiro</b><br>${money(draft.valor)}<br>${draft.pagamentos.length} pagamento(s)</div><div class="summary-block"><b>Posse</b><br>${draft.posse.tipo}</div>`}
function getPath(obj,path){return path.split('.').reduce((o,k)=>o?.[k],obj)} function setPath(obj,path,val){const a=path.split('.');let o=obj;while(a.length>1){const k=a.shift();o=o[k]}o[a[0]]=val}
function bindInputs(){ $$('[data-path]').forEach(el=>el.oninput=()=>{setPath(draft,el.dataset.path,el.type==='number'?Number(el.value):el.value); persistDraft();}); $$('[data-check]').forEach(el=>el.onchange=()=>{draft.clausulas[el.dataset.check]=el.checked;persistDraft();renderWizard();}); }
function persistDraft(){localStorage.setItem('apm_draft',JSON.stringify(draft))}
function nextStep(){syncInputs(); if(step<5){step++;renderWizard()}else finishDeal()} function prevStep(){syncInputs(); if(step>0){step--;renderWizard()}}
function syncInputs(){ $$('[data-path]').forEach(el=>setPath(draft,el.dataset.path,el.type==='number'?Number(el.value):el.value));persistDraft() }
function syncAndRenderFinance(){syncInputs();renderWizard()}
function addPayment(){syncInputs();draft.pagamentos.push({tipo:'Sinal',valor:0,forma:'PIX',condicao:'Na assinatura'});persistDraft();renderWizard()}
function setPay(i,k,v,rerender=false){draft.pagamentos[i][k]=k==='valor'?Number(v):v;persistDraft();if(rerender)renderWizard()}
function removePay(i){draft.pagamentos.splice(i,1);persistDraft();renderWizard()}
function extensoSimples(v){return money(v).replace('R$ ','')+' reais'}
function buildContract(){ const v=draft.vendedor,c=draft.comprador,x=draft.imovel; const pays=draft.pagamentos.map((p,i)=>`${String.fromCharCode(97+i)}) ${p.tipo.toUpperCase()} no valor de ${money(p.valor)} (${extensoSimples(p.valor)}), ${p.condicao||'conforme ajustado'}, por ${p.forma}.`).join('\n'); const area=x.areaEscolhida?` O imóvel possui a metragem selecionada de ${x.areaEscolhida}.`:''; const bens=draft.clausulas.bens&&draft.clausulas.bensTexto?`\n\nCLÁUSULA DÉCIMA PRIMEIRA – DOS BENS QUE PERMANECERÃO NO IMÓVEL\nFica ajustado que permanecerão no imóvel: ${draft.clausulas.bensTexto}.`:''; const posse=draft.clausulas.jaPosse?'O PROMITENTE COMPRADOR já se encontra na posse do imóvel.':`A entrega do imóvel ocorrerá na seguinte condição: ${draft.posse.tipo}${draft.posse.data?' até '+draft.posse.data:''}.`; return `CONTRATO PARTICULAR DE PROMESSA DE COMPRA E VENDA DE IMÓVEL\n\nCLÁUSULA PRIMEIRA – DAS PARTES\nPROMITENTE VENDEDOR(A): ${v.nome||'[NOME DO VENDEDOR]'}, CPF ${v.cpf||'[CPF]'}, ${v.estadoCivil||'[ESTADO CIVIL]'}, ${v.profissao||''}, documento ${v.numeroDoc||'[DOCUMENTO]'}, residente em ${v.endereco||'[ENDEREÇO]'}.\n\nPROMITENTE COMPRADOR(A): ${c.nome||'[NOME DO COMPRADOR]'}, CPF ${c.cpf||'[CPF]'}, ${c.estadoCivil||'[ESTADO CIVIL]'}, ${c.profissao||''}, documento ${c.numeroDoc||'[DOCUMENTO]'}, residente em ${c.endereco||'[ENDEREÇO]'}.\n\nCLÁUSULA SEGUNDA – DO OBJETO\nConstitui objeto o ${x.tipo.toLowerCase()} ${x.complemento||''}, ${x.condominio||''}, situado à ${x.logradouro||'[LOGRADOURO]'}, nº ${x.numero||'[Nº]'}, ${x.bairro||''}, ${x.cidade}/${x.uf}, CEP ${x.cep||'[CEP]'}, registrado sob a matrícula nº ${x.matricula||'[MATRÍCULA]'} perante ${x.cartorio||'[CARTÓRIO]'}.${area}\n\nCLÁUSULA TERCEIRA – DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO\nO preço certo e ajustado é de ${money(draft.valor)} (${extensoSimples(draft.valor)}), pago da seguinte forma:\n${pays||'[PAGAMENTOS NÃO INFORMADOS]'}\n\nCLÁUSULA QUARTA – DA POSSE E ENTREGA\n${posse}\n\nCLÁUSULA QUINTA – DOS ENCARGOS\nOs encargos anteriores à posse permanecerão sob responsabilidade do vendedor, salvo ajuste expresso em contrário.\n\nCLÁUSULA SEXTA – DAS DESPESAS\nITBI: ${draft.despesas.itbi}. Registro: ${draft.despesas.registro}. Escritura: ${draft.despesas.escritura}.\n\nCLÁUSULA SÉTIMA – DAS SANÇÕES\nA parte inadimplente ficará sujeita à multa padrão de 10% sobre o valor total do imóvel, sem prejuízo das demais consequências contratualmente previstas.\n\nCLÁUSULA OITAVA – DA ESCRITURA DEFINITIVA\nApós o cumprimento das obrigações financeiras, as partes adotarão as providências necessárias à transferência definitiva do imóvel.\n\nCLÁUSULA NONA – DAS DISPOSIÇÕES GERAIS\nAs partes declaram estar de acordo com as condições da negociação.\n\nCLÁUSULA DÉCIMA – DA IRREVOGABILIDADE\nO presente contrato é celebrado em caráter irrevogável e irretratável, ressalvadas as hipóteses previstas no próprio instrumento.${bens}\n\nCLÁUSULA FINAL – DO FORO\nFica eleito o foro da comarca de ${x.cidade||'Manaus'}/${x.uf||'AM'}.\n\n${x.cidade||'Manaus'}/${x.uf||'AM'}, ____ de __________________ de 20__.\n\n__________________________________\nVENDEDOR(A): ${v.nome||''}\nCPF: ${v.cpf||''}\n\n__________________________________\nCOMPRADOR(A): ${c.nome||''}\nCPF: ${c.cpf||''}\n\nTESTEMUNHAS\n1. ______________________________\n2. ______________________________` }
function saveDraft(){syncInputs();alert('Rascunho salvo neste navegador.')}
function finishDeal(){syncInputs(); const code='NEG-'+String(Math.max(...deals.map(d=>Number(d.codigo.replace(/\D/g,''))),12)+1).padStart(4,'0'); deals.unshift({codigo:code,imovel:`${draft.imovel.condominio||draft.imovel.tipo} ${draft.imovel.complemento||''}`.trim(),comprador:draft.comprador.nome||'Comprador',vendedor:draft.vendedor.nome||'Vendedor',valor:draft.valor,status:'Em elaboração',data:new Date().toLocaleDateString('pt-BR')}); localStorage.setItem('apm_deals',JSON.stringify(deals));renderTables();alert(`Negociação ${code} salva.`);goPage('dashboard')}
function downloadDoc(){const html=`<html><meta charset="utf-8"><body style="font-family:Arial;white-space:pre-wrap;line-height:1.5">${buildContract().replaceAll('&','&amp;').replaceAll('<','&lt;')}</body></html>`; const blob=new Blob([html],{type:'application/msword'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='APM_CONTRATO_PROTOTIPO.doc';a.click();URL.revokeObjectURL(a.href)}
function loadExample(){draft={vendedor:{nome:'NIVIA TATIANA DA SILVA TEOFILO',cpf:'436.273.742-15',estadoCivil:'Solteira',profissao:'',documento:'RG',numeroDoc:'1118192-3 SSP/AM',endereco:'Manaus/AM'},comprador:{nome:'ELAINE CRISTINA DE OLIVEIRA D’OSSO',cpf:'074.754.407-70',estadoCivil:'Divorciada',profissao:'',documento:'RG',numeroDoc:'07475440770 SSP/AM',endereco:'Manaus/AM'},imovel:{tipo:'Apartamento',condominio:'Edifício Vila das Flores',logradouro:'Avenida Coronel Cyrilo Neves',numero:'1280',complemento:'Apartamento 501 — Torre Jasmim',bairro:'Compensa',cidade:'Manaus',uf:'AM',cep:'',matricula:'39.739',cartorio:'3º Ofício de Registro de Imóveis de Manaus/AM',inscricao:'',areaEscolhida:''},valor:290000,pagamentos:[{tipo:'Sinal',valor:144495,forma:'PIX',condicao:'Na assinatura'},{tipo:'Financiamento',valor:145505,forma:'Financiamento bancário',condicao:'Após aprovação bancária'}],posse:{tipo:'Data específica',data:'2026-09-15',texto:''},despesas:{itbi:'Comprador',registro:'Comprador',escritura:'Comprador',anteriores:'Vendedor'},clausulas:{bens:true,bensTexto:'ares-condicionados dos quartos; ventiladores de teto; armários da cozinha e da área de serviço; racks da sala; suporte para rede na varanda; persianas dos quartos',quitacao:false,jaPosse:false,procuracao:false,corretagem:false}};persistDraft();step=1;goPage('nova')}
renderAll();

// ===== APM Contratos v0.2 — laboratório de leitura documental =====
const testExtractions={
  'CNH nova.pdf':{type:'CNH',confidence:'Alta',fields:[
    ['Nome','JOSE RODRIGO ORESTES DE SOUSA','CNH'],['CPF','809.814.532-87','CNH'],['RG','17298580 SSP/AM','CNH'],['Nascimento','21/03/1985','CNH'],['Nacionalidade','BRASILEIRO','CNH'],['Registro CNH','03425731404','CNH']
  ],pending:['Estado civil não consta na CNH','Profissão não consta na CNH'],preview:'pdf'},
  'CNH - Soraya.pdf':{type:'CNH',confidence:'Média',fields:[
    ['Nome','SORAYA LOPES NERY','CNH'],['CPF','715.769.592-87','CNH'],['RG','16029259 SSP/AM','CNH'],['Nascimento','04/05/1982','CNH'],['Registro CNH','03664581146','CNH']
  ],pending:['Estado civil deve vir de certidão','Profissão não localizada'],preview:'pdf'},
  'Certidão de Casamento.pdf':{type:'Certidão de casamento',confidence:'Alta',fields:[
    ['Cônjuge 1','JOSÉ RODRIGO ORESTES DE SOUSA','Certidão'],['Cônjuge 2','SORAYA LOPES NERY','Certidão'],['Regime de bens','Comunhão Parcial de Bens','Certidão'],['Data do registro','26/01/2015','Certidão'],['Matrícula','004143 01 55 2015 3 00093 084 0002311 10','Certidão']
  ],pending:[],preview:'pdf'},
  'wallet_RG-DIGITAL.pdf':{type:'CIN',confidence:'Alta',fields:[
    ['Nome','SAMARA GABRIELLE DOS SANTOS VIEIRA CORREIA','CIN'],['CPF','020.899.262-90','CIN'],['Nascimento','04/07/2005','CIN'],['Nacionalidade','BRASILEIRA','CIN'],['Naturalidade','MANAUS/AM','CIN'],['Estado civil','Solteiro(a)','CIN']
  ],pending:['Profissão não localizada'],preview:'pdf'},
  'CPF.pdf':{type:'CPF',confidence:'Média',fields:[
    ['Nome','REJANE DOS SANTOS VIEIRA','CPF'],['CPF','666.817.582-15','CPF'],['Nascimento','24/08/1981','CPF']
  ],pending:['Documento de identidade necessário para qualificação completa'],preview:'pdf'},
  'RG Rejane.pdf':{type:'RG',confidence:'Média',fields:[
    ['Nome','REJANE DOS SANTOS VIEIRA','RG'],['RG','1512606-4','RG'],['Nascimento','24/08/1981','RG'],['Naturalidade','TIANGUÁ/CE','RG'],['Expedição','02/09/2015','RG']
  ],pending:['CPF não aparece com clareza neste RG; usar documento de CPF'],preview:'pdf'},
  'comp residencia orestes.pdf':{type:'Comprovante de endereço',confidence:'Alta',fields:[
    ['Titular','JOSE RODRIGO ORESTES DE SOUSA','Amazonas Energia'],['Logradouro','AV RAMOS FERREIRA','Amazonas Energia'],['Número','321','Amazonas Energia'],['Complemento','AP-4','Amazonas Energia'],['Bairro','N SRA APARECIDA','Amazonas Energia'],['CEP','69.010-425','Amazonas Energia'],['Cidade/UF','MANAUS/AM','Amazonas Energia']
  ],pending:[],preview:'pdf'},
  '1555524595377_m.pdf':{type:'Matrícula',confidence:'Alta',fields:[
    ['Matrícula','24.220','Registro de Imóveis'],['Cartório','2º Ofício de Registro de Imóveis e Protesto de Títulos','Registro de Imóveis'],['Cidade/UF','Manaus/AM','Registro de Imóveis'],['Tipo','Apartamento','Registro de Imóveis'],['Condomínio','Condomínio 04 - Villa Jardim Torquato','Registro de Imóveis'],['Unidade','Apto 401, Bloco 08','Registro de Imóveis']
  ],pending:['Confirmar titularidade atual','Revisar atos registrais e gravames'],preview:'pdf'},
  '8444410865231_m.pdf':{type:'Matrícula',confidence:'Alta',fields:[
    ['Matrícula','11.766','Registro de Imóveis'],['Cartório','2º Ofício de Registro de Imóveis de Pacajus/CE','Registro de Imóveis'],['Cidade/UF','Pacajus/CE','Registro de Imóveis'],['Endereço atualizado','Avenida A, nº 336, Pedra Branca','Registro de Imóveis'],['Área construída registrada','86,55 m²','Registro de Imóveis']
  ],pending:['Confirmar proprietário atual','Verificar situação da alienação fiduciária'],preview:'pdf'},
  '8444426533578_m.pdf':{type:'Matrícula',confidence:'Alta',fields:[
    ['Matrícula','12.211','Registro de Imóveis'],['Cartório','2º Ofício de Registro de Imóveis de Pacajus/CE','Registro de Imóveis'],['Cidade/UF','Pacajus/CE','Registro de Imóveis'],['Endereço atualizado','Rua Chico Lira, nº 189, Pedra Branca','Registro de Imóveis'],['Área construída registrada','70,40 m²','Registro de Imóveis']
  ],pending:['Confirmar proprietário atual','Verificar atos posteriores ao registro de compra e venda'],preview:'pdf'}
};

let lastReaderExtraction=null;
function cleanValue(v){return (v||'').toString().trim()}
function splitCityUf(v){const m=cleanValue(v).match(/(.+?)[\/-]([A-Z]{2})$/i);return m?[m[1].trim(),m[2].toUpperCase()]:['','']}
function applyPersonField(person,key,val,docType){
  val=cleanValue(val); if(!val)return;
  const map={nome:'nome',cpf:'cpf',rg:'numeroDoc',cnh:'numeroDoc',nacionalidade:'nacionalidade',nascimento:'nascimento',estado_civil:'estadoCivil',regime:'regimeBens',endereco:'endereco'};
  if(map[key] && (!person[map[key]] || key==='estado_civil' || key==='regime')) person[map[key]]=val;
  if((key==='rg'||key==='cnh')&&val){person.documento=key==='cnh'?'CNH':'RG'}
}
function applyExtractionToDraft(out,role,notify=true){
  const fields=out.fields||[]; const by=Object.fromEntries(fields.map(x=>[x.key,x.value]));
  if(role==='Vendedor'||role==='Comprador'){
    const person=role==='Vendedor'?draft.vendedor:draft.comprador;
    fields.forEach(x=>applyPersonField(person,x.key,x.value,out.document_type));
    if(by.titular && !person.nome) person.nome=by.titular;
    if(by.endereco) person.endereco=by.endereco;
    if(out.document_type==='Certidão de casamento'){
      person.estadoCivil='Casado(a)'; person.regimeBens=by.regime||person.regimeBens;
      const n=(person.nome||'').toUpperCase(); const a=(by.conjuge1||'').toUpperCase(), b=(by.conjuge2||'').toUpperCase();
      if(n && a && n.includes(a.split(' ')[0])) person.conjuge=by.conjuge2||person.conjuge;
      else if(n && b && n.includes(b.split(' ')[0])) person.conjuge=by.conjuge1||person.conjuge;
      else person.conjuge=by.conjuge2||by.conjuge1||person.conjuge;
    }
  }else if(role==='Imóvel'){
    const x=draft.imovel;
    if(by.matricula)x.matricula=by.matricula;
    if(by.cnm)x.cnm=by.cnm;
    if(by.cartorio)x.cartorio=by.cartorio;
    if(by.inscricao)x.inscricao=by.inscricao;
    if(by.tipo_imovel)x.tipo=by.tipo_imovel;
    if(by.condominio)x.condominio=by.condominio;
    if(by.complemento)x.complemento=by.complemento;
    if(by.endereco)x.logradouro=by.endereco;
    else if(by.descricao && !x.logradouro)x.logradouro=by.descricao;
    if(by.descricao_registral)x.descricaoRegistral=by.descricao_registral;
    if(by.titular_atual_sugerido)x.titularSugerido=by.titular_atual_sugerido;
    else if(by.proprietario_inicial && !x.titularSugerido)x.titularSugerido=by.proprietario_inicial;
    if(by.atos)x.atosRegistrarios=by.atos;
    if(by.area_privativa_registro)x.areaPrivativaRegistro=by.area_privativa_registro;
    if(by.area_total_registro)x.areaTotalRegistro=by.area_total_registro;
    if(by.area_construida_registro)x.areaConstruidaRegistro=by.area_construida_registro;
    if(by.cidade_uf){const [c,u]=splitCityUf(by.cidade_uf); if(c)x.cidade=c; if(u)x.uf=u;}
  }
  persistDraft(); if(notify)alert(`Dados de ${role} aplicados à negociação. Revise antes de gerar o contrato.`);
}
function applyReaderToDraft(){if(!lastReaderExtraction){alert('Processe um documento primeiro.');return} applyExtractionToDraft(lastReaderExtraction,$('#readerRole').value,true);}

let readerCurrentFile=null;
function readerFileSelected(inp){
  const f=inp.files&&inp.files[0]; readerCurrentFile=f||null; $('#readerFileName').textContent=f?`${f.name} — ${(f.size/1024).toFixed(0)} KB`:'Nenhum arquivo selecionado';
  const preview=$('#readerPreview'); if(!f){preview.innerHTML='<span>Selecione um arquivo para visualizar.</span>';return}
  if(/^image\//.test(f.type)){const url=URL.createObjectURL(f);preview.innerHTML=`<img src="${url}" alt="Prévia">`}
  else preview.innerHTML=`<div style="text-align:center"><b>${f.name}</b><p>PDF selecionado</p><small>A visualização PDF completa será feita pelo backend/visualizador.</small></div>`;
}
function classifyByFilename(name){const n=name.toLowerCase();if(n.includes('casamento'))return'Certidão de casamento';if(n.includes('nascimento'))return'Certidão de nascimento';if(n.includes('cnh'))return'CNH';if(n.includes('rg'))return n.includes('digital')?'CIN':'RG';if(n.includes('cpf'))return'CPF';if(n.includes('resid')||n.includes('endere'))return'Comprovante de endereço';if(/_m\.pdf$/.test(n))return'Matrícula';return'Documento';}
async function processReaderFile(){
  if(!readerCurrentFile){alert('Selecione um documento.');return}
  const name=readerCurrentFile.name; const forced=$('#readerType').value;
  $('#readerStatus').textContent='Processando...';
  try{
    const fd=new FormData(); fd.append('file',readerCurrentFile); fd.append('declared_type',forced); fd.append('role',$('#readerRole').value);
    const res=await fetch('/api/extract',{method:'POST',body:fd});
    if(!res.ok)throw new Error('backend indisponível');
    const out=await res.json(); lastReaderExtraction=out;
    const fields=(out.fields||[]).map(x=>[x.label||x.key,x.value||'',x.source||out.method||'Leitura local']);
    renderReaderResult({type:out.document_type||forced,confidence:out.confidence||'Média',fields,pending:out.pending||[]},out.document_type||forced,name,true);
    if(out.pages) $('#readerStatus').textContent += ` • ${out.pages} pág.`;
    return;
  }catch(e){
    const match=testExtractions[name];
    if(match){renderReaderResult(match,forced==='auto'?match.type:forced,name);return}
    const detected=forced==='auto'?classifyByFilename(name):forced;
    renderReaderResult({type:detected,confidence:'Servidor não conectado',fields:[['Arquivo',name,'Upload'],['Tipo detectado',detected,'Classificação local']],pending:['Inicie o servidor APM para extrair conteúdo real de arquivos novos.']},detected,name);
  }
}
function renderReaderResult(data,type,name,canApply=false){
  $('#readerStatus').textContent=`${type} • confiança ${data.confidence}`;
  $('#readerResult').innerHTML=data.fields.map(f=>`<div class="extract-card"><small>${f[0]}</small><b>${f[1]}</b><div class="src">Fonte: ${f[2]}</div></div>`).join('');
  const pend=data.pending||[]; $('#readerPending').innerHTML=(canApply?'<button class="primary" onclick="applyReaderToDraft()">Aplicar dados à negociação</button><div style="height:10px"></div>':'')+(pend.length?pend.map(x=>`<div class="pending-item">⚠ ${x}</div>`).join(''):'<div class="ok-item">✓ Nenhuma pendência automática neste teste.</div>');
}
function loadDocumentTestSet(){
  const list=Object.keys(testExtractions); const html=`<div class="reader-test-list">${list.map(n=>`<button onclick="loadNamedTest('${n.replaceAll("'","\\'")}')"><b>${n}</b><br><small>${testExtractions[n].type}</small></button>`).join('')}</div>`;
  $('#readerPreview').innerHTML=html; $('#readerFileName').textContent='Conjunto de teste carregado — clique em um documento'; $('#readerStatus').textContent='Conjunto de homologação'; $('#readerResult').innerHTML='<div class="empty-lite">Escolha um documento na lista ao lado para visualizar a extração estruturada.</div>';
}
function loadNamedTest(name){
  readerCurrentFile={name, size:0, type:'application/pdf'}; $('#readerFileName').textContent=name; const data=testExtractions[name]; renderReaderResult(data,data.type,name); $('#readerPreview').innerHTML=`<div style="text-align:center"><b>${name}</b><p>${data.type}</p><small>Documento de teste já cadastrado para homologação.</small></div>`;
}


// ===== integração com servidor local v0.4 =====
async function checkBackend(){
  const p=$('#backendPill'); if(!p)return;
  try{const r=await fetch('/api/health'); if(!r.ok)throw 0; const j=await r.json(); p.textContent=j.ocr?'● Online + OCR':'● Online'; p.classList.add('online'); p.title=j.ocr?'Servidor online e OCR pronto':'Servidor online; OCR indisponível no servidor'; updateOcrCard();}
  catch(e){p.textContent='● Modo navegador'; p.classList.remove('online'); p.title='Abra pelo servidor local para leitura real e geração DOCX/PDF';}
}
async function updateOcrCard(){
  const el=$('#ocrStatusBox'); if(!el)return;
  try{const r=await fetch('/api/ocr-status'); const j=await r.json();
    if(j.ready)el.innerHTML=`<div class="ok-item"><b>✓ Tesseract OCR pronto</b><br><small>${j.path||''}</small></div>`;
    else el.innerHTML=`<div class="pending-item"><b>OCR não instalado/detectado.</b><br>Documentos digitais continuam funcionando. ${j.can_auto_install?'Clique abaixo para instalar automaticamente pelo Windows.':''}</div>${j.can_auto_install?'<button class="primary" onclick="installOcr()">Instalar Tesseract automaticamente</button>':''}`;
  }catch(e){el.innerHTML='<div class="pending-item">Servidor local não conectado.</div>'}
}
async function installOcr(){
  const el=$('#ocrStatusBox'); if(el)el.innerHTML='<div class="pending-item">Instalando Tesseract... isso pode levar alguns minutos. Não feche o APM.</div>';
  try{const r=await fetch('/api/install-tesseract',{method:'POST'}); const j=await r.json(); if(!r.ok)throw new Error(j.message||'Falha'); alert(j.message); await updateOcrCard(); await checkBackend();}
  catch(e){alert('Não foi possível instalar automaticamente: '+e.message); await updateOcrCard();}
}
function safeFilename(){const base=(draft.imovel.condominio||draft.imovel.tipo||'IMOVEL')+'_'+(draft.comprador.nome||'COMPRADOR');return ('PROMESSA_'+base).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9]+/g,'_').replace(/^_|_$/g,'').toUpperCase()}
async function backendDownload(endpoint,ext){
  syncInputs();
  try{
    const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:'CONTRATO PARTICULAR DE PROMESSA DE COMPRA E VENDA DE IMÓVEL',text:buildContract(),filename:safeFilename()})});
    if(!r.ok)throw new Error(await r.text()); const b=await r.blob(); const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=safeFilename()+'.'+ext;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }catch(e){alert('O servidor local não está ativo. Inicie o APM Contratos pelo arquivo run_windows.bat (ou run_linux_mac.sh).')}
}
function downloadDocx(){return backendDownload('/api/generate-docx','docx')}
function downloadPdf(){return backendDownload('/api/generate-pdf','pdf')}
setTimeout(checkBackend,300);

// ===== APM Contratos Web v0.5 =====
let cloudUser=null;
async function apiJson(url,opts={}){
  const r=await fetch(url,{credentials:'same-origin',...opts});
  let j={}; try{j=await r.json()}catch(e){}
  if(!r.ok) throw new Error(j.message||j.error||'Falha na operação');
  return j;
}

enterApp=async function(){
  const email=$('#loginEmail').value.trim(), password=$('#loginPass').value;
  try{
    const j=await apiJson('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    cloudUser=j.user; $('#login').classList.add('hidden'); $('#app').classList.remove('hidden');
    updateUserUi(); await loadCloudDeals(); renderAll(); await checkBackend();
  }catch(e){alert(e.message)}
}

function updateUserUi(){
  const el=$('#userDisplay'); if(!el||!cloudUser)return;
  el.innerHTML=`${cloudUser.name}<br><small>${cloudUser.role==='admin'?'Administrador':'Corretor'}</small>`;
  const usersNav=document.querySelector('[data-page="usuarios"]'); if(usersNav) usersNav.style.display=cloudUser.role==='admin'?'':'none';
}

async function restoreCloudSession(){
  try{
    const j=await apiJson('/api/me'); cloudUser=j.user; $('#login').classList.add('hidden'); $('#app').classList.remove('hidden'); updateUserUi(); await loadCloudDeals(); renderAll(); await checkBackend();
  }catch(e){ $('#login').classList.remove('hidden'); $('#app').classList.add('hidden'); }
}

async function loadCloudDeals(){
  try{
    const rows=await apiJson('/api/negotiations');
    deals=rows.length?rows:defaults;
    localStorage.setItem('apm_deals',JSON.stringify(deals));
  }catch(e){ deals=JSON.parse(localStorage.getItem('apm_deals')||'null')||defaults; }
}

async function saveCloudDraft(status='Rascunho'){
  syncInputs();
  const codigo=draft._cloudCode||'';
  const j=await apiJson('/api/negotiations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({codigo,status,draft})});
  draft._cloudCode=j.codigo; persistDraft(); return j;
}

saveDraft=async function(){
  try{const j=await saveCloudDraft('Rascunho'); alert(`Rascunho ${j.codigo} salvo na nuvem.`)}catch(e){alert('Não foi possível salvar na nuvem: '+e.message)}
}

finishDeal=async function(){
  try{
    const j=await saveCloudDraft('Em elaboração'); await loadCloudDeals(); renderTables(); alert(`Negociação ${j.codigo} salva na nuvem.`); goPage('dashboard');
  }catch(e){alert('Não foi possível salvar a negociação: '+e.message)}
}

async function createCloudUser(){
  try{
    await apiJson('/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:$('#newUserName').value.trim(),email:$('#newUserEmail').value.trim(),password:$('#newUserPass').value,role:$('#newUserRole').value})});
    $('#newUserName').value=''; $('#newUserEmail').value=''; $('#newUserPass').value=''; alert('Usuário criado.'); await loadCloudUsers();
  }catch(e){alert(e.message)}
}

async function loadCloudUsers(){
  const box=$('#usersList'); if(!box||!cloudUser||cloudUser.role!=='admin')return;
  try{const rows=await apiJson('/api/users'); box.innerHTML=rows.map(u=>`<div class="ok-item"><b>${u.name}</b><br><small>${u.email} • ${u.role}</small></div>`).join('')||'<span class="muted-note">Nenhum usuário.</span>'}catch(e){box.innerHTML=`<div class="pending-item">${e.message}</div>`}
}

const _goPageWeb=goPage;
goPage=function(name){_goPageWeb(name); if(name==='usuarios')loadCloudUsers();}

checkBackend=async function(){
  const p=$('#backendPill'); if(!p)return;
  try{const j=await apiJson('/api/health'); p.textContent=j.ocr?'● Nuvem + OCR':'● Nuvem online'; p.classList.add('online'); p.title='APM Contratos Web v'+j.version; updateOcrCard();}
  catch(e){p.textContent='● Offline'; p.classList.remove('online'); p.title='Servidor indisponível';}
}

updateOcrCard=async function(){
  const el=$('#ocrStatusBox'); if(!el)return;
  try{const j=await apiJson('/api/ocr-status');
    if(j.ready)el.innerHTML=`<div class="ok-item"><b>✓ OCR do servidor pronto</b><br><small>Os corretores não precisam instalar nada nos dispositivos.</small></div>`;
    else el.innerHTML='<div class="pending-item"><b>OCR do servidor indisponível.</b><br>Na versão hospedada via Docker o Tesseract é instalado automaticamente no servidor.</div>';
  }catch(e){el.innerHTML='<div class="pending-item">Servidor indisponível.</div>'}
}

// Na web, instalação local de OCR não é necessária.
installOcr=async function(){alert('Na versão web o OCR fica instalado no servidor. Nenhum corretor precisa instalar Tesseract no computador ou celular.')}

window.addEventListener('load',restoreCloudSession);
