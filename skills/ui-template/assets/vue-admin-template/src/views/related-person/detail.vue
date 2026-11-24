<script setup lang="ts">
import ArrowLeft from "~icons/ep/arrow-left-bold";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { relatedPersons } from "./data";

defineOptions({ name: "RelatedPersonDetail" });

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const person = computed(() =>
  relatedPersons.find(item => item.id === String(route.params.id))
);

function goBack() {
  router.push({ name: "Welcome" });
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <el-button link :icon="ArrowLeft" @click="goBack">
        {{ t("starter.relatedPeople.backToList") }}
      </el-button>
    </div>

    <section
      v-if="person"
      class="border border-(--pure-border-color) bg-(--el-bg-color-overlay) p-6"
    >
      <div
        class="flex flex-col gap-4 border-b border-(--pure-border-color) pb-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-center gap-3">
          <el-avatar :size="48" class="bg-(--el-color-primary)">
            {{ person.name.slice(0, 1) }}
          </el-avatar>
          <div>
            <h1 class="text-xl font-medium text-(--el-text-color-primary)">
              {{ person.name }}
            </h1>
            <p class="mt-1 text-sm text-(--el-text-color-secondary)">
              {{ t("starter.relatedPeople.detailDescription") }}
            </p>
          </div>
        </div>
        <el-tag
          :type="person.reviewStatus === 'passed' ? 'success' : 'warning'"
        >
          {{ t(`starter.relatedPeople.status.${person.reviewStatus}`) }}
        </el-tag>
      </div>

      <div class="grid gap-x-8 gap-y-6 pt-6 sm:grid-cols-2">
        <div>
          <p class="text-sm text-(--el-text-color-secondary)">
            {{ t("starter.relatedPeople.relationshipLabel") }}
          </p>
          <p class="mt-1 text-(--el-text-color-primary)">
            {{ t(`starter.relatedPeople.relationship.${person.relationship}`) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-(--el-text-color-secondary)">
            {{ t("starter.relatedPeople.applicantId") }}
          </p>
          <p class="mt-1 break-all text-(--el-text-color-primary)">
            {{ person.applicantId }}
          </p>
        </div>
        <div>
          <p class="text-sm text-(--el-text-color-secondary)">
            {{ t("starter.relatedPeople.submittedAt") }}
          </p>
          <p class="mt-1 text-(--el-text-color-primary)">
            {{ person.submittedAt }}
          </p>
        </div>
      </div>
    </section>

    <el-empty v-else :description="t('starter.relatedPeople.notFound')" />
  </div>
</template>
