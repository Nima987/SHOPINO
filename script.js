(function(){
    const overlay = document.getElementById('product-modal-overlay');
    const modalImage = document.getElementById('modal-image');
    const modalName = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDetails = document.getElementById('modal-details');
    const modalBuy = document.getElementById('modal-buy');
    const closeBtn = document.querySelector('.modal-close');
  
    // helper: open modal with data object
    function openModal(data) {
      modalImage.src = data.img || 'pics/placeholder.png';
      modalImage.alt = data.name || '';
      modalName.textContent = data.name || 'Product';
      modalPrice.textContent = data.price || '';
      // details: if array given, render as paragraphs; else raw HTML/text
      if (Array.isArray(data.details)) {
        modalDetails.innerHTML = data.details.map(d=>`<p>${d}</p>`).join('');
      } else {
        modalDetails.innerHTML = data.details || '';
      }
      // set buy link (if price or sku passed, could add query)
      modalBuy.href = data.buyUrl || 'buy.html';
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden','false');
      // lock scroll
      document.body.style.overflow = 'hidden';
      // focus for accessibility
      closeBtn.focus();
    }
  
    function closeModal() {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    }
  
    // close handlers
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  
    // attach click on each product-card (delegation possible)
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      // prevent opening when clicking on links inside card
      if (e.target.closest('a')) return;
  
      // gather data: prefer data-* attributes, fallback to DOM
      const data = {};
      data.name = card.dataset.name || (card.querySelector('.name') ? card.querySelector('.name').textContent.trim() : null);
      data.price = card.dataset.price || (card.querySelector('.price') ? card.querySelector('.price').textContent.trim() : '');
      const imgEl = card.querySelector('.product-image');
      data.img = card.dataset.img || (imgEl ? imgEl.src : (card.dataset.imgPlaceholder || 'pics/placeholder.png'));
      data.buyUrl = card.dataset.buy || 'buy.html';
  
      // details: if data-details attribute exists (JSON or newline separated) try to parse
      if (card.dataset.details) {
        try {
          const parsed = JSON.parse(card.dataset.details);
          data.details = Array.isArray(parsed) ? parsed : String(parsed);
        } catch (err) {
          // fallback: treat as newline-separated text
          data.details = card.dataset.details.split('\n').map(s => s.trim()).filter(Boolean);
        }
      } else {
        // fallback: you can customize what to show—here we'll show static placeholders
        data.details = [
          card.dataset.material ? `Material: ${card.dataset.material}` : 'Material: Cotton',
          card.dataset.sizes ? `Available sizes: ${card.dataset.sizes}` : 'Available sizes: S, M, L'
        ];
      }
  
      // open modal with collected data
      openModal(data);
    });
  })();