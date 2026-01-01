import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe.html',
  styleUrl: './recipe.scss',
})
export class RecipeComponent {
  ingredients: any[] = [
    { name: 'Pale Malt (2 Row)', amount: '5 kg', desc: 'Base malt with light color and neutral flavor profile ideal for ales.' },
    { name: 'Cascade Hops', amount: '50 g', desc: 'Classic American hop known for citrus/grapefruit notes.' }
  ];

  newIng = { name: '', amount: '', desc: '' };

  constructor(private sanitizer: DomSanitizer) {
    // Sanitize initial data (mocking trust for demo purposes or showing valid HTML)
    this.ingredients.forEach(ing => {
      ing.desc = this.sanitizer.bypassSecurityTrustHtml(ing.desc);
    });
  }

  addIngredient() {
    if (this.newIng.name) {
      // BUG: XSS Vulnerability
      // Allows user to input HTML (Rich Text) but doesn't sanitize it.
      // User can input: <img src=x onerror=alert(1)>
      const unsafeDesc = this.newIng.desc;
      const trustedDesc = this.sanitizer.bypassSecurityTrustHtml(unsafeDesc);

      this.ingredients.push({ ...this.newIng, desc: trustedDesc });
      this.newIng = { name: '', amount: '', desc: '' };
    }
  }
}
