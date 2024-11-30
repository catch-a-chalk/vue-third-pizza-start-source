<template>
  <main class="content">
    <form action="#" method="post">
      <div class="content__wrapper">
        <h1 class="title title--big">Конструктор пиццы</h1>

        <dough-selector v-model="pizza.dough" :items="doughItems" />

        <diameter-selector v-model="pizza.size" :items="sizeItems" />

        <div class="content__ingredients">
          <div class="sheet">
            <h2 class="title title--small sheet__title">
              Выберите ингредиенты
            </h2>

            <div class="sheet__content ingredients">
              <sauce-selector v-model="pizza.sauce" :items="sauceItems" />

              <ingredients-selector
                :values="pizza.ingredients"
                :items="ingredientItems"
                @update="updateIngredientAmount"
              />
            </div>
          </div>
        </div>

        <div class="content__pizza">
          <label class="input">
            <span class="visually-hidden">Название пиццы</span>
            <input
              v-model="name"
              type="text"
              name="pizza_name"
              placeholder="Введите название пиццы"
            />
          </label>

          <dough-selector v-model="doughId" :items="dataStore.doughs" />

          <diameter-selector v-model="sizeId" :items="dataStore.sizes" />

          <sauce-selector v-model="sauceId" :items="dataStore.sauces" />

          <ingredients-selector
            :values="pizzaStore.ingredients"
            :items="dataStore.ingredients"
            @update="pizzaStore.setIngredientQuantity"
          />

          <pizza-constructor
            :dough="pizzaStore.dough.value"
            :sauce="pizzaStore.sauce.value"
            :ingredients="pizzaStore.ingredientsExtended"
            @drop="pizzaStore.incrementIngredientQuantity"
          />

          <div class="content__result">
            <p>Итого: {{ price }} ₽</p>
            <button
              type="button"
              class="button"
              :disabled="disableSubmit"
              @click="addToCart"
              >
                Готовьте!
            </button>
          </div>
        </div>
      </div>
    </form>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive } from "vue";
import {
  normalizeDough,
  normalizeIngredients,
  normalizeSauces,
  normalizeSize,
} from "@/common/helpers/normalize";
import DoughSelector from "@/modules/constructor/DoughSelector.vue";
import DiameterSelector from "@/modules/constructor/DiameterSelector.vue";
import SauceSelector from "@/modules/constructor/SauceSelector.vue";
import IngredientsSelector from "@/modules/constructor/IngredientsSelector.vue";
import PizzaConstructor from "@/modules/constructor/PizzaConstructor.vue";
import doughJSON from "@/mocks/dough.json";
import ingredientsJSON from "@/mocks/ingredients.json";
import saucesJSON from "@/mocks/sauces.json";
import sizesJSON from "@/mocks/sizes.json";

import { useDataStore } from "@/stores/data";
import { usePizzaStore } from "@/stores/pizza";
import { useCartStore } from "@/stores/cart";
import { routerKey, useRouter } from "vue-router";

const dataStore = useDataStore();
const pizzaStore = usePizzaStore();
const cartStore = useCartStore();

const doughItems = doughJSON.map(normalizeDough);
const ingredientItems = ingredientsJSON.map(normalizeIngredients);
const sauceItems = saucesJSON.map(normalizeSauces);
const sizeItems = sizesJSON.map(normalizeSize);

const pizza = reactive({
  name: "",
  dough: doughItems[0].value,
  size: sizeItems[0].value,
  sauce: sauceItems[0].value,
  ingredients: ingredientItems.reduce((acc, item) => {
    acc[item.value] = 0;
    return acc;
  }, {}),
});

const price = computed(() => {
  const { dough, size, sauce, ingredients } = pizza;

  const sizeMultiplier =
    sizeItems.find((item) => item.value === size)?.multiplier ?? 1;

  const doughPrice =
    doughItems.find((item) => item.value === dough)?.price ?? 0;

  const saucePrice =
    sauceItems.find((item) => item.value === sauce)?.price ?? 0;

  /*
   * Здесь мы при помощи метода map превращаем массив ингредиентов
   * в массив значений, соответствующих итоговой стоимости каждого из них - просто умножив известную цену на количество.
   * После чего методом reduce вычисляем сумму всех элементов массива, что даст нам общую стоимость всех ингредиентов.
   */
  const ingredientsPrice = ingredientItems
    .map((item) => ingredients[item.value] * item.price)
    .reduce((acc, item) => acc + item, 0);

  return (doughPrice + saucePrice + ingredientsPrice) * sizeMultiplier;
});

const disableSubmit = computed(() => {
  return name.value.length === 0 || pizzaStore.price === 0;
});

const addIngredient = (ingredient) => {
  pizza.ingredients[ingredient]++;
};

const updateIngredientAmount = (ingredient, count) => {
  pizza.ingredients[ingredient] = count;
};

const name = computed({
  get() {
    return pizzaStore.name;
  },
  set(value) {
    pizzaStore.setName(value);
  },
});

const doughId = computed({
  get() {
    return pizzaStore.doughId;
  },
  set(value) {
    pizzaStore.setDough(value);
  },
});

const sizeId = computed({
  get() {
    return pizzaStore.sizeId;
  },
  set(value) {
    pizzaStore.setSize(value);
  },
});

const sauceId = computed({
  get() {
    return pizzaStore.sauceId;
  },
  set(value) {
    pizzaStore.setSauce(value);
  },
});

const touter = useRouter()

const addToCart = async () => {
  cartStore.savePizza(pizzaStore.$state);
  await routerKey.push({ name: "cart" });
  resetPizza();
};

const resetPizza = () => {
  pizzaStore.setName("");
  pizzaStore.setDough(dataStore.doughs[0].id);
  pizzaStore.setSize(dataStore.sizes[0].id);
  pizzaStore.setSauce(dataStore.sauces[0].id);
  pizzaStore.setIngredients([]);
  pizzaStore.setIndex(null);
};

onMounted(() => {
  if (pizzaStore.index === null) {
    resetPizza();
  }
});
</script>

<style lang="scss">
@import "@/assets/scss/ds-system/ds.scss";
@import "@/assets/scss/mixins/mixins.scss";

.content__ingredients {
  width: 527px;
  margin-top: 15px;
  margin-right: auto;
  margin-bottom: 15px;
}

.content__pizza {
  width: 373px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.content__result {
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 25px;

  p {
    @include b-s24-h28;

    margin: 0;
  }

  button {
    margin-left: 12px;
    padding: 16px 45px;
  }
}
</style>