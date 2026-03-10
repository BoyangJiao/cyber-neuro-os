# Git 工作流规则 (Git Workflow Rules)

为了确保生产环境的稳定性，本项采用以下分支管理策略：

## 1. 分支角色
- **`main`**: 生产环境分支。永远保持稳定，只有经过预发环境验证的代码才能合并至此。
- **`staging`**: 预发环境分支。用于在线预览和最终测试。关联 Vercel 的预览部署。
- **`dev`**: 开发分支。日常功能开发和修复。

## 2. 合并规则 (Rules)
1. **代码流向**: `dev` -> `staging` -> `main`。
2. **禁止越级**: 严禁直接将 `dev` 分支合并至 `main` 分支。
3. **预发验证**: 所有新功能在合并到 `main` 之前，必须先合并到 `staging` 并在 Vercel 生成的预览链接中进行实测。
4. **发布标准**: 只有当预发环境验证无误后，才可将 `staging` 合并至 `main` 进行线上发布。

## 3. 常用操作命令

### 情况 A：开发完成，准备进入预发测试
```bash
git checkout staging
git merge dev
git push origin staging
```

### 情况 B：预发测试通过，准备上线
```bash
git checkout main
git merge staging
git push origin main
```

### 情况 C：遇到紧急 Bug 需要直接在预发修复 (不推荐)
建议在 `dev` 修复后再走正常流程，若必须在预发修复，修复后需同步回 `dev`。
