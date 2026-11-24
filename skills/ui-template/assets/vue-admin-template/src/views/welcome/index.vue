<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import RelatedPersonCard from "../related-person/components/RelatedPersonCard.vue";
import { relatedPersons } from "../related-person/data";

defineOptions({ name: "Welcome" });

const { t } = useI18n();
const router = useRouter();

function viewRelatedPerson(personId: string) {
  router.push({
    name: "RelatedPersonDetail",
    params: { id: personId }
  });
}
</script>

<template>
  <div class="space-y-4">
    <section
      class="border border-(--pure-border-color) bg-(--el-bg-color-overlay) p-6"
    >
      <h1 class="text-xl font-medium text-(--el-text-color-primary)">
        {{ t("starter.welcomeTitle") }}
      </h1>
      <p class="mt-2 text-(--el-text-color-secondary)">
        {{ t("starter.welcomeDescription") }}
      </p>
    </section>

    <section
      class="border border-(--pure-border-color) bg-(--el-bg-color-overlay) p-6"
    >
      <div
        class="flex flex-col gap-2 border-b border-(--pure-border-color) pb-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 class="text-lg font-medium text-(--el-text-color-primary)">
            {{ t("starter.relatedPeople.sectionTitle") }}
          </h2>
          <p class="mt-1 text-sm text-(--el-text-color-secondary)">
            {{ t("starter.relatedPeople.sectionDescription") }}
          </p>
        </div>
        <el-tag size="small" effect="plain">
          {{
            t("starter.relatedPeople.count", { count: relatedPersons.length })
          }}
        </el-tag>
      </div>

      <div class="grid gap-4 pt-5 lg:grid-cols-2">
        <RelatedPersonCard
          v-for="person in relatedPersons"
          :key="person.id"
          :person="person"
          @view-detail="viewRelatedPerson"
        />
      </div>
    </section>
  </div>
</template>
