<script setup lang="ts">
import ArrowRight from "~icons/ep/arrow-right-bold";
import { useI18n } from "vue-i18n";
import type { RelatedPerson } from "../data";

defineOptions({ name: "RelatedPersonCard" });

defineProps<{
  person: RelatedPerson;
}>();

const emit = defineEmits<{
  viewDetail: [personId: string];
}>();

const { t } = useI18n();
</script>

<template>
  <article
    class="flex min-h-64 flex-col border border-(--pure-border-color) bg-(--el-bg-color-overlay) p-5 transition-shadow hover:shadow-md"
  >
    <div class="flex items-start gap-3">
      <el-avatar :size="44" class="shrink-0 bg-(--el-color-primary)">
        {{ person.name.slice(0, 1) }}
      </el-avatar>
      <div class="min-w-0">
        <h3
          class="truncate text-base font-medium text-(--el-text-color-primary)"
        >
          {{ person.name }}
        </h3>
        <p class="mt-1 text-sm text-(--el-text-color-secondary)">
          {{ t("starter.relatedPeople.relationshipLabel") }}：{{
            t(`starter.relatedPeople.relationship.${person.relationship}`)
          }}
        </p>
      </div>
    </div>

    <dl class="mt-5 grid gap-3 text-sm sm:grid-cols-2">
      <div>
        <dt class="text-(--el-text-color-secondary)">
          {{ t("starter.relatedPeople.applicantId") }}
        </dt>
        <dd class="mt-1 break-all text-(--el-text-color-primary)">
          {{ person.applicantId }}
        </dd>
      </div>
      <div>
        <dt class="text-(--el-text-color-secondary)">
          {{ t("starter.relatedPeople.reviewStatus") }}
        </dt>
        <dd class="mt-1">
          <el-tag
            size="small"
            :type="person.reviewStatus === 'passed' ? 'success' : 'warning'"
          >
            {{ t(`starter.relatedPeople.status.${person.reviewStatus}`) }}
          </el-tag>
        </dd>
      </div>
      <div class="sm:col-span-2">
        <dt class="text-(--el-text-color-secondary)">
          {{ t("starter.relatedPeople.submittedAt") }}
        </dt>
        <dd class="mt-1 text-(--el-text-color-primary)">
          {{ person.submittedAt }}
        </dd>
      </div>
    </dl>

    <div class="mt-auto flex justify-end pt-5">
      <el-button
        type="primary"
        link
        :icon="ArrowRight"
        @click="emit('viewDetail', person.id)"
      >
        {{ t("starter.relatedPeople.viewDetail") }}
      </el-button>
    </div>
  </article>
</template>
