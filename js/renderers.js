export function getImpactBadge(impactLevel) {
  if (impactLevel === 'high') return { className: 'badge-hi', label: 'High impact', dot: '#D03535' };
  if (impactLevel === 'moderate') return { className: 'badge-mod', label: 'Moderate', dot: '#C98B0A' };
  return { className: 'badge-low', label: 'Supporting', dot: '#10A679' };
}

export function getConfidenceBadge(confidence) {
  if (confidence === 'high') return { label: 'High confidence', bg: '#E8FAF4', color: '#0F7B58' };
  if (confidence === 'medium') return { label: 'Medium confidence', bg: '#FFF8E5', color: '#8A5A00' };
  return { label: 'Low confidence', bg: '#F3F5FB', color: '#5B6480' };
}

export function renderSelectOptions(selectEl, items, includeAllLabel) {
  if (!selectEl) return;
  const options = [`<option value="all">${includeAllLabel}</option>`]
    .concat(items.map((item) => `<option value="${item.id}">${item.label}</option>`));
  selectEl.innerHTML = options.join('');
}

export function renderPrinciples(container, principles, state) {
  if (!container) return;
  if (!principles.length) {
    container.innerHTML = '<div style="padding:40px;text-align:center;color:var(--on-surf-var);background:var(--surf-white);border:1px solid var(--outline-var);border-radius:var(--r-lg);">No principles match these filters. Try broadening your search.</div>';
    return;
  }

  container.innerHTML = principles.map((principle, index) => createCard(principle, index === 0, state.selectedPrincipleId)).join('');
}

function createCard(principle, openByDefault, selectedPrincipleId) {
  const badge = getImpactBadge(principle.impactLevel);
  const confidence = getConfidenceBadge(principle.confidence);
  const isOpen = openByDefault || selectedPrincipleId === principle.id ? 'open' : '';
  const reasons = principle.reasons.slice(0, 2).map((reason) => `<li class="evidence-item is-fresh" style="font:400 12.5px/1.5 'Roboto';color:var(--on-surf);">${reason}</li>`).join('');
  const evidenceChips = (principle.evidence || []).slice(0, 3).map((item) => `<span style="font:700 10.5px/1 'Roboto';color:var(--on-surf-var);background:var(--surf-low);border:1px solid var(--outline-var);border-radius:var(--r-full);padding:4px 10px;">${item.label}</span>`).join('');
  const actions = principle.actions.map((action) => `<li style="display:flex;align-items:flex-start;gap:7px;font:400 13px/1.55 'Roboto';color:var(--on-surf);"><span class="mi" style="font-size:14px;color:var(--pri);margin-top:1px;">check_circle</span>${action.description}</li>`).join('');
  const patterns = principle.uiPatterns.map((item) => `<li style="display:flex;align-items:flex-start;gap:7px;font:400 13px/1.55 'Roboto';color:var(--on-surf);"><span class="mi" style="font-size:14px;color:var(--on-surf-var);margin-top:1px;">arrow_forward</span>${item}</li>`).join('');
  const antiPatterns = principle.antiPatterns.map((item) => `<li style="font:400 12.5px/1.5 'Roboto';color:#7A5408;">• ${item}</li>`).join('');

  return `
    <div class="pcard ${isOpen}" id="card-${principle.id}" data-principle-id="${principle.id}">
      <div data-card-toggle="${principle.id}" style="padding:16px 20px;cursor:pointer;display:flex;align-items:flex-start;gap:14px;">
        <span style="font:700 10px/1 'Roboto';color:var(--on-surf-var);padding-top:4px;letter-spacing:.05em;flex-shrink:0;">#${principle.number}</span>
        <div style="flex-shrink:0;width:48px;height:48px;border-radius:12px;background:${principle.color};display:flex;align-items:center;justify-content:center;">
          <span class="mi" style="font-size:24px;color:${principle.iconColor};">${principle.icon}</span>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
            <h4 style="font:700 15px/1.3 'Roboto Flex',sans-serif;color:var(--on-surf);margin:0;">${principle.name}</h4>
            <span class="badge ${badge.className}">${badge.label}</span>
            <span style="font:700 10.5px/1 'Roboto';color:${confidence.color};background:${confidence.bg};padding:3px 9px;border-radius:var(--r-full);border:1px solid rgba(0,0,0,0.06);">${confidence.label}</span>
            <span style="font:700 11px/1 'Roboto';color:var(--pri);background:var(--pri-con);padding:2px 9px;border-radius:var(--r-full);border:1px solid rgba(61,99,221,.15);">${Math.round(principle.score)} score</span>
          </div>
          <p style="font:700 11px/1.4 'Roboto';color:var(--on-surf-var);text-transform:uppercase;letter-spacing:.05em;margin:0 0 5px;">${principle.categories.join(' · ')}</p>
          <p style="font:400 13px/1.6 'Roboto';color:var(--on-surf-var);margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${principle.summary}</p>
        </div>
        <span class="mi chevron">expand_more</span>
      </div>
      <div class="card-body">
        <div style="background:var(--surf-low);border:1px solid var(--outline-var);border-radius:var(--r-sm);padding:14px;margin-bottom:16px;">
          <p style="font:700 10px/1 'Roboto';text-transform:uppercase;letter-spacing:.08em;color:var(--pri);margin:0 0 8px;">Why this matched</p>
          <ul style="margin:0; padding-left:16px; display:flex; flex-direction:column; gap:4px;">${reasons || `<li style="font-size:12.5px; color:#3B4466; line-height:1.5;">Strong general fit for the current selection.</li>`}</ul>
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:10px;">${evidenceChips}</div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:16px;">
          <div>
            <p style="font:700 10px/1 'Roboto';text-transform:uppercase;letter-spacing:.08em;color:var(--on-surf-var);margin:0 0 10px;display:flex;align-items:center;gap:4px;"><span class="mi" style="font-size:13px;color:var(--pri);">construction</span>Design Actions</p>
            <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px;">${actions}</ul>
          </div>
          <div>
            <p style="font:700 10px/1 'Roboto';text-transform:uppercase;letter-spacing:.08em;color:var(--on-surf-var);margin:0 0 10px;display:flex;align-items:center;gap:4px;"><span class="mi" style="font-size:13px;color:var(--pri);">layers</span>UI Patterns</p>
            <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px;">${patterns}</ul>
          </div>
        </div>
        ${principle.designPrompt ? `<div style="background:var(--pri-con);border:1px solid rgba(61,99,221,.18);border-radius:var(--r-sm);padding:14px;margin-bottom:14px;"><p style="font:700 10px/1 'Roboto';text-transform:uppercase;letter-spacing:.08em;color:var(--pri);margin:0 0 7px;display:flex;align-items:center;gap:4px;"><span class="mi" style="font-size:13px;">edit</span>Design Prompt</p><p style="font:400 13px/1.6 'Roboto';color:var(--on-surf);margin:0;font-style:italic;">${principle.designPrompt}</p></div>` : ''}
        <div style="background:#FFF8E5;border:1px solid #F2D28A;border-radius:var(--r-sm);padding:14px;margin-bottom:14px;">
          <p style="font:700 10px/1 'Roboto';text-transform:uppercase;letter-spacing:.08em;color:#7A5408;margin:0 0 8px;display:flex;align-items:center;gap:4px;"><span class="mi" style="font-size:13px;color:#C98B0A;">warning</span>Anti-Patterns to Avoid</p>
          <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">${antiPatterns}</ul>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn-primary" data-apply-principle="${principle.id}"><span class="mi" style="font-size:16px;">auto_awesome</span><span data-button-label>Generate AI Prompt</span></button>
          <button class="btn-ghost" data-select-principle="${principle.id}"><span class="mi" style="font-size:16px;">visibility</span>View Details</button>
        </div>
      </div>
    </div>
  `;
}

export function renderPagination(infoEl, buttonsEl, totalItems, currentPage, itemsPerPage) {
  if (!infoEl || !buttonsEl) return;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const start = totalItems === 0 ? 0 : ((currentPage - 1) * itemsPerPage + 1);
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  infoEl.textContent = totalItems ? `Showing ${start}–${end} of ${totalItems} principles` : 'No principles found';

  let html = `<button data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} style="padding:6px 10px;border-radius:var(--r-sm);border:1px solid var(--outline-var);background:var(--surf-white);color:${currentPage === 1 ? 'var(--outline-var)' : 'var(--on-surf-var)'};cursor:${currentPage === 1 ? 'not-allowed' : 'pointer'};display:flex;align-items:center;"><span class="mi" style="font-size:16px;">chevron_left</span></button>`;
  for (let page = 1; page <= totalPages; page += 1) {
    const active = page === currentPage;
    html += `<button data-page="${page}" style="padding:6px 14px;border-radius:var(--r-sm);border:1px solid ${active ? 'var(--pri)' : 'transparent'};background:${active ? 'var(--pri-con)' : 'transparent'};color:${active ? 'var(--pri)' : 'var(--on-surf-var)'};font:${active ? '700' : '500'} 12.5px/1 'Roboto';cursor:pointer;">${page}</button>`;
  }
  html += `<button data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} style="padding:6px 10px;border-radius:var(--r-sm);border:1px solid var(--outline-var);background:var(--surf-white);color:${currentPage === totalPages ? 'var(--outline-var)' : 'var(--on-surf-var)'};cursor:${currentPage === totalPages ? 'not-allowed' : 'pointer'};display:flex;align-items:center;"><span class="mi" style="font-size:16px;">chevron_right</span></button>`;
  buttonsEl.innerHTML = html;
}

export function renderRightPanel(panelEl, principle, lookup) {
  if (!panelEl || !principle) return;
  const confidence = getConfidenceBadge(principle.confidence);
  const disciplines = principle.disciplines.map((id) => lookup.disciplinesById[id]?.label || id).join(' · ');
  const contexts = principle.contexts.map((id) => lookup.contextsById[id]?.label || id).join(' · ');
  const evidence = (principle.evidence || []).slice(0, 4).map((item) => `<li class="evidence-item is-fresh" style="font-size:12.5px;color:var(--on-surf);line-height:1.6;"><strong>${item.label}:</strong> ${item.reason}</li>`).join('');
  const examples = principle.examples.map((item) => `<li style="font-size:12.5px;color:var(--on-surf);line-height:1.6;">${item}</li>`).join('');
  const references = (lookup.references || {})[principle.id] || [];
  const referencesHtml = references.length ? `
    <div style="margin-bottom:20px;">
      <p style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:var(--on-surf-var);margin:0 0 10px;display:flex;align-items:center;gap:5px;"><span class="mi" style="font-size:13px;color:var(--pri);">menu_book</span>Canonical sources</p>
      <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:8px;">${references.map((ref) => `<li style="font-size:12.5px;color:var(--on-surf-var);line-height:1.6;"><strong style="color:var(--on-surf);">${ref.a} (${ref.y}).</strong> ${ref.t}. <em>${ref.v}</em></li>`).join('')}</ul>
    </div>` : '';
  panelEl.innerHTML = `
    <div style="margin-bottom:20px;">
      <span style="font:700 10px/1 'Roboto';text-transform:uppercase;letter-spacing:.1em;color:var(--pri);background:var(--pri-con);padding:3px 10px;border-radius:var(--r-full);">Selected Principle</span>
      <h2 style="font:700 20px/1.2 'Roboto Flex',sans-serif;color:var(--on-surf);margin:14px 0 6px;">${principle.name}</h2>
      <p style="font:400 12.5px/1.7 'Roboto';color:var(--on-surf-var);margin:0;font-style:italic;">${principle.summary}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
        <span style="font:700 10.5px/1 'Roboto';color:${confidence.color};background:${confidence.bg};padding:3px 9px;border-radius:var(--r-full);">${confidence.label}</span>
        <span style="font:700 10.5px/1 'Roboto';color:var(--pri);background:var(--pri-con);padding:3px 9px;border-radius:var(--r-full);">${Math.round(principle.score)} score</span>
      </div>
    </div>
    <div style="border-top:1px solid var(--outline-var);padding-top:18px;margin-bottom:18px;">
      <p style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:var(--on-surf-var);margin:0 0 10px;">Why it matters</p>
      <p style="font-size:13px;color:var(--on-surf);margin:0;">${principle.description}</p>
    </div>
    <div style="background:var(--surf-low);border:1px solid var(--outline-var);border-radius:var(--r-sm);padding:14px;margin-bottom:16px;">
      <p style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:var(--pri);margin:0 0 8px;">Best fit</p>
      <p style="font-size:12px;color:var(--on-surf);margin:0 0 8px;line-height:1.6;">${principle.whenToUse}</p>
      <p style="font-size:11px;color:var(--on-surf-var);margin:0;"><strong>Disciplines:</strong> ${disciplines}<br/><strong>Contexts:</strong> ${contexts}</p>
    </div>
    <div style="margin-bottom:20px;">
      <p style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:var(--on-surf-var);margin:0 0 10px;">Evidence</p>
      <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:8px;">${evidence}</ul>
    </div>
    ${principle.designPrompt ? `<div style="background:var(--pri-con);border:1px solid rgba(61,99,221,.18);border-radius:var(--r-sm);padding:14px;margin-bottom:16px;"><p style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:var(--pri);margin:0 0 8px;display:flex;align-items:center;gap:5px;"><span class="mi" style="font-size:13px;">edit</span>Design Prompt</p><p style="font-size:13px;color:var(--on-surf);margin:0;line-height:1.65;font-style:italic;">${principle.designPrompt}</p></div>` : ''}
    <div style="margin-bottom:20px;">
      <p style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:var(--on-surf-var);margin:0 0 10px;">Examples</p>
      <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:8px;">${examples}</ul>
    </div>
    ${referencesHtml}
    <div style="display:flex;flex-direction:column;gap:8px;">
      <button class="btn-primary" style="width:100%;justify-content:center;padding:11px 20px;border-radius:var(--r-full);" data-apply-principle="${principle.id}"><span class="mi" style="font-size:16px;">auto_awesome</span><span data-button-label>Generate AI Prompt</span></button>
    </div>
  `;
}
