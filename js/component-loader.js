export class ComponentLoader {
  constructor() {
    this.loadedComponents = new Set();
  }

  async loadComponent(componentName) {
    if (this.loadedComponents.has(componentName)) {
      return;
    }

    try {
      const response = await fetch(`./components/${componentName}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${componentName}`);
      }
      
      const html = await response.text();
      document.body.insertAdjacentHTML('beforeend', html);
      this.loadedComponents.add(componentName);
      
      console.log(`Component loaded: ${componentName}`);
    } catch (error) {
      console.error(`Error loading component ${componentName}:`, error);
    }
  }

  async loadAllComponents() {
    const components = ['product-card', 'cart-item', 'modal', 'products-section', 'cart-section'];
    
    for (const component of components) {
      await this.loadComponent(component);
    }
  }

  getTemplate(templateId) {
    const template = document.getElementById(templateId);
    if (!template) {
      console.error(`Template not found: ${templateId}`);
      return null;
    }
    return template.content.cloneNode(true);
  }
}

export const componentLoader = new ComponentLoader(); 