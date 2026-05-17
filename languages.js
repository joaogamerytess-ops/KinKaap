const languages = {
    pt: {
        minhas_receitas: 'Minhas Receitas',
        descobrir_receitas: 'Descobrir Receitas',
        em_destaque: 'Em Destaque',
        configuracoes: 'Configurações',
        idioma: 'Idioma',
        nova_receita: 'Nova Receita',
        nenhuma_receita: 'Nenhuma receita criada ainda',
        nenhuma_receita_compartilhada: 'Nenhuma receita compartilhada ainda',
        nenhuma_receita_destaque: 'Nenhuma receita em destaque',
        buscar_receita: '🔍 Buscar receita...',
        nome_receita: 'Nome da Receita',
        categoria: 'Categoria',
        salgado: 'Salgado',
        doce: 'Doce',
        bebida: 'Bebida',
        salada: 'Salada',
        outro: 'Outro',
        ingredientes: 'Ingredientes',
        modo_preparo: 'Modo de Preparo',
        tempo_preparo: 'Tempo de Preparo (min)',
        cancelar: 'Cancelar',
        salvar: 'Salvar Receita',
        compartilhar: 'Compartilhar',
        descompartilhar: 'Descompartilhar',
        editar: 'Editar',
        deletar: 'Deletar',
        comentarios: 'Comentários',
        adicionar_comentario: 'Adicione um comentário...',
        enviar: 'Enviar',
        favoritar: 'Favoritar',
        desfavoritar: 'Desfavoritar',
        curtir: 'Curtir',
        descurtir: 'Descurtir',
        curtidas: 'Curtidas',
        compartilhamentos: 'Compartilhamentos'
    },
    en: {
        minhas_receitas: 'My Recipes',
        descobrir_receitas: 'Discover Recipes',
        em_destaque: 'Featured',
        configuracoes: 'Settings',
        idioma: 'Language',
        nova_receita: 'New Recipe',
        nenhuma_receita: 'No recipes created yet',
        nenhuma_receita_compartilhada: 'No shared recipes yet',
        nenhuma_receita_destaque: 'No featured recipes',
        buscar_receita: '🔍 Search recipe...',
        nome_receita: 'Recipe Name',
        categoria: 'Category',
        salgado: 'Savory',
        doce: 'Sweet',
        bebida: 'Beverage',
        salada: 'Salad',
        outro: 'Other',
        ingredientes: 'Ingredients',
        modo_preparo: 'Instructions',
        tempo_preparo: 'Prep Time (min)',
        cancelar: 'Cancel',
        salvar: 'Save Recipe',
        compartilhar: 'Share',
        descompartilhar: 'Unshare',
        editar: 'Edit',
        deletar: 'Delete',
        comentarios: 'Comments',
        adicionar_comentario: 'Add a comment...',
        enviar: 'Send',
        favoritar: 'Favorite',
        desfavoritar: 'Unfavorite',
        curtir: 'Like',
        descurtir: 'Unlike',
        curtidas: 'Likes',
        compartilhamentos: 'Shares'
    },
    es: {
        minhas_receitas: 'Mis Recetas',
        descobrir_receitas: 'Descubrir Recetas',
        em_destaque: 'Destacados',
        configuracoes: 'Configuración',
        idioma: 'Idioma',
        nova_receita: 'Nueva Receta',
        nenhuma_receita: 'Aún no hay recetas creadas',
        nenhuma_receita_compartilhada: 'Aún no hay recetas compartidas',
        nenhuma_receita_destaque: 'Sin recetas destacadas',
        buscar_receita: '🔍 Buscar receta...',
        nome_receita: 'Nombre de la Receta',
        categoria: 'Categoría',
        salgado: 'Salado',
        doce: 'Dulce',
        bebida: 'Bebida',
        salada: 'Ensalada',
        outro: 'Otro',
        ingredientes: 'Ingredientes',
        modo_preparo: 'Instrucciones',
        tempo_preparo: 'Tiempo de Preparación (min)',
        cancelar: 'Cancelar',
        salvar: 'Guardar Receta',
        compartilhar: 'Compartir',
        descompartilhar: 'Dejar de Compartir',
        editar: 'Editar',
        deletar: 'Eliminar',
        comentarios: 'Comentarios',
        adicionar_comentario: 'Añade un comentario...',
        enviar: 'Enviar',
        favoritar: 'Favoritar',
        desfavoritar: 'Quitar de Favoritos',
        curtir: 'Me gusta',
        descurtir: 'No me gusta',
        curtidas: 'Me gusta',
        compartilhamentos: 'Comparticiones'
    }
};

let currentLanguage = localStorage.getItem('language') || 'pt';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updatePageLanguage();
}

function updatePageLanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (languages[currentLanguage][key]) {
            el.textContent = languages[currentLanguage][key];
        }
    });

    // Update placeholders
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (languages[currentLanguage][key]) {
            el.placeholder = languages[currentLanguage][key];
        }
    });
}

function t(key) {
    return languages[currentLanguage][key] || key;
}

document.addEventListener('DOMContentLoaded', () => {
    updatePageLanguage();
});