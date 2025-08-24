// 社員管理システム - 共通JavaScript

// =========================
// 共通設定
// =========================

// API設定（実際の実装時に使用）
const API_BASE_URL = '/api';

// ローカルストレージキー
const STORAGE_KEYS = {
    USER: 'employee_system_user',
    TOKEN: 'employee_system_token',
    THEME: 'employee_system_theme'
};

// =========================
// ユーティリティ関数
// =========================

/**
 * 要素の表示/非表示切り替え
 */
function toggleElement(elementId, show = null) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (show === null) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    } else {
        element.style.display = show ? 'block' : 'none';
    }
}

/**
 * 要素にクラス追加/削除
 */
function toggleClass(elementId, className, add = null) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (add === null) {
        element.classList.toggle(className);
    } else {
        element.classList.toggle(className, add);
    }
}

/**
 * アラート表示
 */
function showAlert(message, type = 'info', duration = 5000) {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <span>${message}</span>
        <button type="button" class="close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    alertContainer.appendChild(alertDiv);
    
    // 自動削除
    if (duration > 0) {
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, duration);
    }
}

/**
 * アラートコンテナ作成
 */
function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10001;
        max-width: 400px;
    `;
    document.body.appendChild(container);
    return container;
}

/**
 * ローディング表示
 */
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const loadingHtml = '<div class="loading"></div>';
    element.innerHTML = loadingHtml;
}

/**
 * ローディング非表示
 */
function hideLoading(elementId, originalContent = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = originalContent;
}

/**
 * 日付フォーマット
 */
function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    switch (format) {
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'YYYY/MM/DD':
            return `${year}/${month}/${day}`;
        case 'MM/DD':
            return `${month}/${day}`;
        default:
            return `${year}-${month}-${day}`;
    }
}

/**
 * 文字列の日本語バリデーション
 */
function validateJapaneseText(text, maxLength = 100) {
    if (!text || text.trim() === '') {
        return false;
    }
    return text.length <= maxLength;
}

/**
 * メールアドレスバリデーション
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 電話番号バリデーション
 */
function validatePhoneNumber(phone) {
    const phoneRegex = /^[\d\-\(\)\+\s]+$/;
    return phoneRegex.test(phone);
}

// =========================
// データ管理
// =========================

/**
 * ローカルストレージからデータ取得
 */
function getStorageData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Storage get error:', error);
        return null;
    }
}

/**
 * ローカルストレージにデータ保存
 */
function setStorageData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Storage set error:', error);
        return false;
    }
}

/**
 * ローカルストレージからデータ削除
 */
function removeStorageData(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Storage remove error:', error);
        return false;
    }
}

// =========================
// モーダル管理
// =========================

/**
 * モーダル表示
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // ESCキーでモーダルを閉じる
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal(modalId);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

/**
 * モーダル非表示
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

/**
 * モーダル外クリックで閉じる
 */
function setupModalClickOutside() {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });
}

// =========================
// フォーム管理
// =========================

/**
 * フォームデータを取得
 */
function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return {};
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

/**
 * フォームにデータを設定
 */
function setFormData(formId, data) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    Object.keys(data).forEach(key => {
        const element = form.querySelector(`[name="${key}"]`);
        if (element) {
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = Boolean(data[key]);
            } else {
                element.value = data[key] || '';
            }
        }
    });
}

/**
 * フォームをリセット
 */
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.reset();
    
    // カスタムエラーメッセージをクリア
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(element => element.remove());
    
    // バリデーションクラスをクリア
    const validatedElements = form.querySelectorAll('.is-invalid, .is-valid');
    validatedElements.forEach(element => {
        element.classList.remove('is-invalid', 'is-valid');
    });
}

/**
 * フォームバリデーション
 */
function validateForm(formId, rules = {}) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    
    // 既存のエラーメッセージをクリア
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(element => element.remove());
    
    Object.keys(rules).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        const rule = rules[fieldName];
        const value = field.value.trim();
        
        // 必須チェック
        if (rule.required && !value) {
            showFieldError(field, rule.messages?.required || '必須項目です');
            isValid = false;
            return;
        }
        
        // 最小文字数チェック
        if (rule.minLength && value.length < rule.minLength) {
            showFieldError(field, rule.messages?.minLength || `${rule.minLength}文字以上で入力してください`);
            isValid = false;
            return;
        }
        
        // 最大文字数チェック
        if (rule.maxLength && value.length > rule.maxLength) {
            showFieldError(field, rule.messages?.maxLength || `${rule.maxLength}文字以内で入力してください`);
            isValid = false;
            return;
        }
        
        // メールバリデーション
        if (rule.email && value && !validateEmail(value)) {
            showFieldError(field, rule.messages?.email || '正しいメールアドレスを入力してください');
            isValid = false;
            return;
        }
        
        // 電話番号バリデーション
        if (rule.phone && value && !validatePhoneNumber(value)) {
            showFieldError(field, rule.messages?.phone || '正しい電話番号を入力してください');
            isValid = false;
            return;
        }
        
        // カスタムバリデーション
        if (rule.custom && typeof rule.custom === 'function') {
            const customResult = rule.custom(value);
            if (customResult !== true) {
                showFieldError(field, customResult || 'エラーが発生しました');
                isValid = false;
                return;
            }
        }
        
        // バリデーション成功
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    });
    
    return isValid;
}

/**
 * フィールドエラー表示
 */
function showFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-danger mt-5';
    errorDiv.style.fontSize = '14px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// =========================
// テーブル管理
// =========================

/**
 * テーブルソート機能
 */
function setupTableSort(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const headers = table.querySelectorAll('th[data-sortable]');
    
    headers.forEach(header => {
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        
        header.addEventListener('click', function() {
            const column = this.dataset.sortable;
            const currentOrder = this.dataset.order || 'asc';
            const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
            
            // ヘッダーのソート状態を更新
            headers.forEach(h => {
                h.removeAttribute('data-order');
                h.innerHTML = h.innerHTML.replace(' ▲', '').replace(' ▼', '');
            });
            
            this.dataset.order = newOrder;
            this.innerHTML += newOrder === 'asc' ? ' ▲' : ' ▼';
            
            // テーブルをソート
            sortTable(table, column, newOrder);
        });
    });
}

/**
 * テーブルソート実行
 */
function sortTable(table, column, order) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.querySelector(`td[data-column="${column}"]`)?.textContent.trim() || '';
        const bValue = b.querySelector(`td[data-column="${column}"]`)?.textContent.trim() || '';
        
        // 数値かどうかチェック
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return order === 'asc' ? aNum - bNum : bNum - aNum;
        } else {
            return order === 'asc' ? 
                aValue.localeCompare(bValue, 'ja') : 
                bValue.localeCompare(aValue, 'ja');
        }
    });
    
    // ソート後の行を再配置
    rows.forEach(row => tbody.appendChild(row));
}

// =========================
// 初期化処理
// =========================

document.addEventListener('DOMContentLoaded', function() {
    // モーダルの外クリック処理を設定
    setupModalClickOutside();
    
    // テーブルソート機能を自動設定
    document.querySelectorAll('table[data-sortable]').forEach(table => {
        setupTableSort(table.id);
    });
    
    // フォームの自動バリデーション設定
    document.querySelectorAll('form[data-validate]').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!this.checkValidity()) {
                e.preventDefault();
                showAlert('入力内容を確認してください', 'danger');
            }
        });
    });
    
    // ツールチップ初期化
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});

// =========================
// エクスポート（必要に応じて）
// =========================

// 共通関数をグローバルに公開
window.EmployeeSystem = {
    // ユーティリティ
    toggleElement,
    toggleClass,
    showAlert,
    showLoading,
    hideLoading,
    formatDate,
    validateEmail,
    validatePhoneNumber,
    validateJapaneseText,
    
    // データ管理
    getStorageData,
    setStorageData,
    removeStorageData,
    
    // モーダル管理
    showModal,
    closeModal,
    
    // フォーム管理
    getFormData,
    setFormData,
    resetForm,
    validateForm,
    
    // テーブル管理
    setupTableSort,
    sortTable
};