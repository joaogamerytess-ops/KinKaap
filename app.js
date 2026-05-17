// ===== DATA MANAGEMENT =====
class RecipeManager {
    constructor() {
        this.recipes = this.loadRecipes();
        this.currentEditId = null;
    }

    loadRecipes() {
        const stored = localStorage.getItem('kinkaap_recipes');
        return stored ? JSON.parse(stored) : [];
    }

    saveRecipes() {
        localStorage.setItem('kinkaap_recipes', JSON.stringify(this.recipes));
    }

    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    addRecipe(recipe) {
        const newRecipe = {
            id: this.generateId(),
            ...recipe,
            isShared: false,
            createdAt: new Date().toISOString(),
            likes: 0,
            liked: false,
            comments: [],
            favorited: false
        };
        this.recipes.push(newRecipe);
        this.saveRecipes();
        return newRecipe;
    }

    updateRecipe(id, updatedData) {
        const recipe = this.recipes.find(r => r.id === id);
        if (recipe) {
            Object.assign(recipe, updatedData);
            this.saveRecipes();
        }
        return recipe;
    }

    deleteRecipe(id) {
        this.recipes = this.recipes.filter(r => r.id !== id);
        this.saveRecipes();
    }

    getRecipe(id) {
        return this.recipes.find(r => r.id === id);
    }

    getMyRecipes() {
        return this.recipes;
    }

    getSharedRecipes() {
        return this.recipes.filter(r => r.isShared);
    }

    getFeaturedRecipes() {
        return this.recipes
            .filter(r => r.isShared)
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 20);
    }

    shareRecipe(id) {
        return this.updateRecipe(id, { isShared: true });
    }

    unshareRecipe(id) {
        return this.updateRecipe(id, { isShared: false });
    }

    toggleLike(id) {
        const recipe = this.getRecipe(id);
        if (recipe) {
            recipe.liked = !recipe.liked;
            recipe.likes = recipe.liked ? recipe.likes + 1 : recipe.likes - 1;
            this.saveRecipes();
        }
        return recipe;
    }

    addComment(id, comment) {
        const recipe = this.getRecipe(id);
        if (recipe) {
            recipe.comments.push({
                id: this.generateId(),
                text: comment,
                createdAt: new Date().toISOString()
            });
            this.saveRecipes();
        }
        return recipe;
    }

    toggleFavorite(id) {
        const recipe = this.getRecipe(id);
        if (recipe) {
            recipe.favorited = !recipe.favorited;
            this.saveRecipes();
        }
        return recipe;
    }

    searchRecipes(recipes, query) {
        if (!query) return recipes;
        const q = query.toLowerCase();
        return recipes.filter(r => 
            r.name.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q)
        );
    }
}

const recipeManager = new RecipeManager();

// ===== DOM ELEMENTS =====
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const createBtn = document.getElementById('createBtn');
const recipeModal = document.getElementById('recipeModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const recipeName = document.getElementById('recipeName');
const recipeCategory = document.getElementById('recipeCategory');
const recipeIngredients = document.getElementById('recipeIngredients');
const recipeInstructions = document.getElementById('recipeInstructions');
const recipePrepTime = document.getElementById('recipePrepTime');
const modalTitle = document.getElementById('modalTitle');
const minhasReceitasContainer = document.getElementById('minhasReceitasContainer');
const descobrirContainer = document.getElementById('descobrirContainer');
const destaqueContainer = document.getElementById('destaqueContainer');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const langBtns = document.querySelectorAll('.lang-btn');
const detailModal = document.getElementById('detailModal');
const closeDetail = document.getElementById('closeDetail');

// ===== TAB NAVIGATION =====
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        switchTab(tabName);
    });
});

function switchTab(tabName) {
    tabContents.forEach(tab => tab.classList.remove('active'));
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    if (tabName === 'minhas') renderMyRecipes();
    if (tabName === 'descobrir') renderDiscoverRecipes();
    if (tabName === 'destaque') renderFeaturedRecipes();
}

// ===== RECIPE MODAL =====
createBtn.addEventListener('click', openCreateModal);
closeModal.addEventListener('click', closeRecipeModal);
cancelBtn.addEventListener('click', closeRecipeModal);
saveBtn.addEventListener('click', saveRecipe);

function openCreateModal() {
    recipeManager.currentEditId = null;
    recipeName.value = '';
    recipeCategory.value = 'salgado';
    recipeIngredients.value = '';
    recipeInstructions.value = '';
    recipePrepTime.value = '';
    modalTitle.textContent = t('nova_receita');
    recipeModal.classList.remove('hidden');
}

function openEditModal(id) {
    const recipe = recipeManager.getRecipe(id);
    if (!recipe) return;
    
    recipeManager.currentEditId = id;
    recipeName.value = recipe.name;
    recipeCategory.value = recipe.category;
    recipeIngredients.value = recipe.ingredients.join('\n');
    recipeInstructions.value = recipe.instructions;
    recipePrepTime.value = recipe.prepTime;
    modalTitle.textContent = 'Editar Receita';
    recipeModal.classList.remove('hidden');
}

function closeRecipeModal() {
    recipeModal.classList.add('hidden');
    recipeManager.currentEditId = null;
}

function saveRecipe() {
    if (!recipeName.value.trim()) {
        alert('Digite um nome para a receita');
        return;
    }

    const recipeData = {
        name: recipeName.value.trim(),
        category: recipeCategory.value,
        ingredients: recipeIngredients.value.split('\n').filter(i => i.trim()),
        instructions: recipeInstructions.value.trim(),
        prepTime: parseInt(recipePrepTime.value) || 0
    };

    if (recipeManager.currentEditId) {
        recipeManager.updateRecipe(recipeManager.currentEditId, recipeData);
    } else {
        recipeManager.addRecipe(recipeData);
    }

    closeRecipeModal();
    renderMyRecipes();
}

// ===== RENDER FUNCTIONS =====
function renderMyRecipes() {
    const searchQuery = document.getElementById('searchMinhas').value;
    let recipes = recipeManager.getMyRecipes();
    recipes = recipeManager.searchRecipes(recipes, searchQuery);
    renderRecipes(minhasReceitasContainer, recipes, 'minhas');
}

function renderDiscoverRecipes() {
    const searchQuery = document.getElementById('searchDescobrir').value;
    let recipes = recipeManager.getSharedRecipes();
    recipes = recipeManager.searchRecipes(recipes, searchQuery);
    renderRecipes(descobrirContainer, recipes, 'descobrir');
}

function renderFeaturedRecipes() {
    const searchQuery = document.getElementById('searchDestaque').value;
    let recipes = recipeManager.getFeaturedRecipes();
    recipes = recipeManager.searchRecipes(recipes, searchQuery);
    renderRecipes(destaqueContainer, recipes, 'destaque');
}

function renderRecipes(container, recipes, source) {
    if (recipes.length === 0) {
        if (source === 'minhas') {
            container.innerHTML = `<p class="empty-state" data-i18n="nenhuma_receita">${t('nenhuma_receita')}</p>`;
        } else if (source === 'descobrir') {
            container.innerHTML = `<p class="empty-state" data-i18n="nenhuma_receita_compartilhada">${t('nenhuma_receita_compartilhada')}</p>`;
        } else {
            container.innerHTML = `<p class="empty-state" data-i18n="nenhuma_receita_destaque">${t('nenhuma_receita_destaque')}</p>`;
        }
        return;
    }

    container.innerHTML = recipes.map(recipe => createRecipeCard(recipe, source)).join('');
    attachCardListeners();
}

function createRecipeCard(recipe, source) {
    const categoryEmoji = {
        'salgado': '🥘',
        'doce': '🍰',
        'bebida': '🥤',
        'salada': '🥗',
        'outro': '🍽️'
    }[recipe.category] || '🍽️';

    const shareBtn = source === 'minhas' 
        ? (recipe.isShared 
            ? `<button class="recipe-btn unshare-btn" data-id="${recipe.id}">${t('descompartilhar')}</button>`
            : `<button class="recipe-btn share-btn" data-id="${recipe.id}">${t('compartilhar')}</button>`)
        : '';

    const editDeleteBtns = source === 'minhas' 
        ? `<button class="recipe-btn edit-btn" data-id="${recipe.id}">${t('editar')}</button>
           <button class="recipe-btn danger delete-btn" data-id="${recipe.id}">${t('deletar')}</button>`
        : '';

    return `
        <div class="recipe-card" data-id="${recipe.id}" data-source="${source}">
            <div class="recipe-card-header">
                <div>
                    <h3 class="recipe-card-title">${recipe.name}</h3>
                    <span class="recipe-category">${categoryEmoji} ${t(recipe.category)}</span>
                </div>
            </div>
            <div class="recipe-card-body">
                <div class="recipe-info">
                    <div class="recipe-info-item">⏱️ ${recipe.prepTime} min</div>
                </div>
                <div class="recipe-stats">
                    <div class="recipe-stat">❤️ ${recipe.likes}</div>
                    <div class="recipe-stat">💬 ${recipe.comments.length}</div>
                </div>
            </div>
            <div class="recipe-card-footer">
                <div class="recipe-actions">
                    ${shareBtn}
                    ${editDeleteBtns}
                    <button class="recipe-btn like-btn" data-id="${recipe.id}">${recipe.liked ? '❤️ Curtido' : '🤍 Curtir'}</button>
                    <button class="recipe-btn favorite-btn" data-id="${recipe.id}">${recipe.favorited ? '⭐ Favoritado' : '☆ Favoritar'}</button>
                </div>
            </div>
        </div>
    `;
}

function attachCardListeners() {
    // Open detail modal on card click
    document.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('recipe-btn')) {
                openDetailModal(card.getAttribute('data-id'));
            }
        });
    });

    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            recipeManager.shareRecipe(id);
            renderMyRecipes();
        });
    });

    // Unshare buttons
    document.querySelectorAll('.unshare-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            recipeManager.unshareRecipe(id);
            renderMyRecipes();
        });
    });

    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            openEditModal(id);
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            if (confirm('Tem certeza que deseja deletar esta receita?')) {
                recipeManager.deleteRecipe(id);
                renderMyRecipes();
            }
        });
    });

    // Like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            recipeManager.toggleLike(id);
            const card = document.querySelector(`[data-id="${id}"]`);
            const source = card.getAttribute('data-source');
            
            if (source === 'minhas') renderMyRecipes();
            if (source === 'descobrir') renderDiscoverRecipes();
            if (source === 'destaque') renderFeaturedRecipes();
        });
    });

    // Favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            recipeManager.toggleFavorite(id);
            const card = document.querySelector(`[data-id="${id}"]`);
            const source = card.getAttribute('data-source');
            
            if (source === 'minhas') renderMyRecipes();
            if (source === 'descobrir') renderDiscoverRecipes();
            if (source === 'destaque') renderFeaturedRecipes();
        });
    });
}

// ===== DETAIL MODAL =====
function openDetailModal(id) {
    const recipe = recipeManager.getRecipe(id);
    if (!recipe) return;

    const detailTitle = document.getElementById('detailTitle');
    const detailContent = document.getElementById('detailContent');

    detailTitle.textContent = recipe.name;

    const ingredientsList = recipe.ingredients.map(i => `<li>${i}</li>`).join('');
    const instructionsList = recipe.instructions.split('\n').map((step, idx) => 
        `<li>${step}</li>`
    ).filter(step => step !== '<li></li>').join('');

    const commentsHtml = recipe.comments.map(comment => `
        <div class="comment">
            <div class="comment-author">Usuário</div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-time">${new Date(comment.createdAt).toLocaleDateString('pt-BR')}</div>
        </div>
    `).join('');

    detailContent.innerHTML = `
        <div class="detail-meta">
            <div class="detail-meta-item">⏱️ ${recipe.prepTime} min</div>
            <div class="detail-meta-item">❤️ ${recipe.likes} curtidas</div>
            <div class="detail-meta-item">💬 ${recipe.comments.length} comentários</div>
        </div>

        <div class="detail-section">
            <h4>${t('ingredientes')}</h4>
            <ul class="ingredients-list">
                ${ingredientsList}
            </ul>
        </div>

        <div class="detail-section">
            <h4>${t('modo_preparo')}</h4>
            <ol class="instructions-list">
                ${instructionsList}
            </ol>
        </div>

        <div class="detail-section">
            <h4>${t('comentarios')}</h4>
            <div class="comment-form">
                <input type="text" class="comment-input" placeholder="${t('adicionar_comentario')}..." id="commentInput">
                <button class="comment-btn" id="addCommentBtn">${t('enviar')}</button>
            </div>
            <div id="commentsList">
                ${commentsHtml || '<p style="color: #999;">Nenhum comentário ainda</p>'}
            </div>
        </div>

        <div class="action-buttons">
            <button class="btn btn-primary like-btn-detail" data-id="${recipe.id}">${recipe.liked ? '❤️ Curtido' : '🤍 Curtir'}</button>
            <button class="btn btn-primary favorite-btn-detail" data-id="${recipe.id}">${recipe.favorited ? '⭐ Favoritado' : '☆ Favoritar'}</button>
            ${recipe.isShared ? `<button class="btn btn-secondary unshare-btn-detail" data-id="${recipe.id}">${t('descompartilhar')}</button>` : `<button class="btn btn-secondary share-btn-detail" data-id="${recipe.id}">${t('compartilhar')}</button>`}
        </div>
    `;

    detailModal.classList.remove('hidden');

    // Comment functionality
    const addCommentBtn = document.getElementById('addCommentBtn');
    const commentInput = document.getElementById('commentInput');

    addCommentBtn.addEventListener('click', () => {
        if (commentInput.value.trim()) {
            recipeManager.addComment(id, commentInput.value.trim());
            openDetailModal(id);
        }
    });

    // Detail modal buttons
    document.querySelector('.like-btn-detail').addEventListener('click', () => {
        recipeManager.toggleLike(id);
        openDetailModal(id);
    });

    document.querySelector('.favorite-btn-detail').addEventListener('click', () => {
        recipeManager.toggleFavorite(id);
        openDetailModal(id);
    });

    const shareBtnDetail = document.querySelector('.share-btn-detail');
    if (shareBtnDetail) {
        shareBtnDetail.addEventListener('click', () => {
            recipeManager.shareRecipe(id);
            openDetailModal(id);
        });
    }

    const unshareBtnDetail = document.querySelector('.unshare-btn-detail');
    if (unshareBtnDetail) {
        unshareBtnDetail.addEventListener('click', () => {
            recipeManager.unshareRecipe(id);
            openDetailModal(id);
        });
    }
}

closeDetail.addEventListener('click', () => {
    detailModal.classList.add('hidden');
});

// ===== SEARCH FUNCTIONALITY =====
document.getElementById('searchMinhas').addEventListener('input', renderMyRecipes);
document.getElementById('searchDescobrir').addEventListener('input', renderDiscoverRecipes);
document.getElementById('searchDestaque').addEventListener('input', renderFeaturedRecipes);

// ===== SETTINGS & LANGUAGE =====
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
});

closeSettings.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
        renderMyRecipes();
        renderDiscoverRecipes();
        renderFeaturedRecipes();
    });
});

// Initialize language button
window.addEventListener('DOMContentLoaded', () => {
    const activeLang = currentLanguage;
    document.querySelector(`[data-lang="${activeLang}"]`).classList.add('active');
});

// Close modals on background click
window.addEventListener('click', (e) => {
    if (e.target === recipeModal) closeRecipeModal();
    if (e.target === settingsModal) settingsModal.classList.add('hidden');
    if (e.target === detailModal) detailModal.classList.add('hidden');
});

// Initialize
renderMyRecipes();